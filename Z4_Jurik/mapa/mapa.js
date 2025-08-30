const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
let markers = [];
let map;

function initMap() {
  var mapOptions = {
    center: { lat: 47, lng: 12 },
    zoom: 5,
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  function addMarkersFromJSON() {
    fetch("images.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);

        if (data && Array.isArray(data.images)) {
          data.images.forEach((item) => {
            var marker = new google.maps.Marker({
              position: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lng),
              },
              map: map,
              title: item.title || "",
            });

            marker.addListener("click", function () {
              openModal(item);
            });
            markers.push(marker);
          });
        }
      });
  }

  addMarkersFromJSON();
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function openModal(image) {
  modal.style.display = "flex";
  modalImg.src = image.url;

  modalImg.innerHTML = "";
}

var imagesArray;
let directionsRenderer;

document.getElementById("routeToggle").addEventListener("change", function () {
  if (this.checked) {
    calculateRoute();
  } else {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    const routeDistanceElement = document.getElementById("routeDistance");
    routeDistanceElement.innerHTML = "";
  }
});

fetch("images.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    imagesArray = data.images;
    console.log("images Array: ", imagesArray);
  });

function calculateRoute() {
  const directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  const waypoints = imagesArray.slice(1, -1).map((location) => ({
    location: new google.maps.LatLng(location.lat, location.lng),
    stopover: true,
  }));

  const request = {
    origin: new google.maps.LatLng(imagesArray[0].lat, imagesArray[0].lng),
    destination: new google.maps.LatLng(
      imagesArray[imagesArray.length - 1].lat,
      imagesArray[imagesArray.length - 1].lng
    ),
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(response);

      const route = response.routes[0];
      let totalDistance = 0;

      route.legs.forEach((leg) => {
        totalDistance += leg.distance.value;
      });

      const totalDistanceKm = totalDistance / 1000;

      const routeDistanceElement = document.getElementById("routeDistance");
      routeDistanceElement.innerHTML = `Trasa je ${totalDistanceKm.toFixed(
        2
      )} km`;
    }
  });
}

google.maps.event.addDomListener(window, "load", initMap);
