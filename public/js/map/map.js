function initialize() {
  var mapOptions = {
    center: { lat: 24.792081, lng: 120.992631},
    zoom: 8
  };
  var map = new google.maps.Map(
    document.getElementById('googleMapDiv'),
  mapOptions);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
    });
  }
}

function  main() {
  // body...
  google.maps.event.addDomListener(
  window, 'load', initialize);
}

main();