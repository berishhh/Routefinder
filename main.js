// Initialize the Google Maps API
var map;
var directionsService;
var directionsDisplay;
var waypoints = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 51.509865, lng: -0.118092 },
  });
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
}

document
  .getElementById("add-waypoint-btn")
  .addEventListener("click", function () {
    var waypointAddress = document.getElementById("waypoint-address-1").value;
    waypoints.push({
      location: waypointAddress,
      stopover: true,
    });
  });

document
  .getElementById("calculate-route-btn")
  .addEventListener("click", function () {
    var startAddress = document.getElementById("start-address").value;
    var endAddress = document.getElementById("end-address").value;
    calculateFastestRoute(startAddress, endAddress, waypoints);
  });

function calculateFastestRoute(start, end, waypoints) {
  var request = {
    origin: start,
    destination: end,
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: "DRIVING",
  };
  directionsService.route(request, function (response, status) {
    if (status === "OK") {
      directionsDisplay.setDirections(response);
      calculateDistance(response);

      // check if waypoint_order property is present
      if (response.routes[0].hasOwnProperty("waypoint_order")) {
        var waypointOrder = response.routes[0].waypoint_order;
        var waypointOrderContainer = document.getElementById("waypoint-order");
        waypointOrderContainer.innerHTML =
          "Waypoint order: " + waypointOrder.join(", ");
      }
    }
  });

  function calculateDistance(response) {
    var distanceContainer = document.getElementById("distance");
    distanceContainer.innerHTML = "";
    var totalDuration = 0;
    for (var i = 0; i < response.routes[0].legs.length; i++) {
      var distance = response.routes[0].legs[i].distance.text;
      var duration = response.routes[0].legs[i].duration.text;
      totalDuration += response.routes[0].legs[i].duration.value;
      if (i == 0) {
        distanceContainer.innerHTML +=
          "Distance from " +
          response.routes[0].legs[i].start_address +
          " to " +
          response.routes[0].legs[i].end_address +
          " is " +
          distance +
          " and it will take about " +
          duration +
          "<br>";
      } else if (i == response.routes[0].legs.length - 1) {
        distanceContainer.innerHTML +=
          "Distance from " +
          response.routes[0].legs[i].start_address +
          " to " +
          response.routes[0].legs[i].end_address +
          " is " +
          distance +
          " and it will take about " +
          duration +
          "<br>";
      } else {
        distanceContainer.innerHTML +=
          "Distance from " +
          response.routes[0].legs[i].start_address +
          " to " +
          response.routes[0].legs[i].end_address +
          " is " +
          distance +
          " and it will take about " +
          duration +
          "<br>";
      }
    }
    var totalDurationInMinutes = totalDuration / 60;
    distanceContainer.innerHTML +=
      "Total duration: " + totalDurationInMinutes.toFixed(2) + " minutes";
  }
  if (response.routes[0].waypoint_order.length > 0) {
    distanceContainer.innerHTML +=
      "Distance between the last leg and the first waypoint is " +
      google.maps.geometry.spherical.computeDistanceBetween(
        response.routes[0].legs[response.routes[0].legs.length - 1]
          .end_location,
        response.routes[0].waypoint_order[0].location
      ) +
      "<br>";
    for (var i = 0; i < response.routes[0].waypoint_order.length - 1; i++) {
      distanceContainer.innerHTML +=
        "Distance from " +
        response.routes[0].waypoint_order[i].location +
        " to " +
        response.routes[0].waypoint_order[i + 1].location +
        " is " +
        google.maps.geometry.spherical.computeDistanceBetween(
          response.routes[0].waypoint_order[i].location,
          response.routes[0].waypoint_order[i + 1].location
        ) +
        "<br>";
    }
    distanceContainer.innerHTML +=
      "Distance from " +
      response.routes[0].waypoint_order[
        response.routes[0].waypoint_order.length - 1
      ].location +
      " to " +
      response.routes[0].legs[0].end_address +
      " is " +
      google.maps.geometry.spherical.computeDistanceBetween(
        response.routes[0].waypoint_order[
          response.routes[0].waypoint_order.length - 1
        ].location,
        response.routes[0].legs[0].end_location
      ) +
      "<br>";
    distanceContainer.innerHTML +=
      "Total Distance: " + totalDistance + " meters";
  }
}
