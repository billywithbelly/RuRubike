var map = {};
var rubikes = [];
var googleMap;
var directionsService;
var directionsDisplay;
var ownMarker;
var target;
var infowindow = new google.maps.InfoWindow();
function initialize() {
  var mapOptions = {
    center: { lat: 24.792081, lng: 120.992631},
    zoom: 18,
    disableDefaultUI: true
  };
  googleMap = new google.maps.Map(
    document.getElementById('googleMapDiv'),
  mapOptions);
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(googleMap);
  var icon = {
    url: 'https://freeiconshop.com/files/edd/person-flat.png', // url
    scaledSize: new google.maps.Size(40, 40), // scaled size
  };
  ownMarker = new google.maps.Marker({
    map:googleMap,
    position:{ lat: 24.792081, lng: 120.992631},
    icon: icon
  });
  setOriginLocation();
  window.addEventListener("deviceorientation", handleOrientation, true);
}

map.lockMove = function () {
  googleMap.setOptions({draggable: false});
}

map.unLockMove = function () {
  googleMap.setOptions({draggable: true});
}

map.setOriginLocation = function() {
  setOriginLocation();
}

map.setBikes = function(bikes) {
  if(rubikes.length==0){
    for(var i=0;i<bikes.length;i++){
      var obj = {};
      obj.bike = bikes[i];
      var icon = {
        url: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-transport-travel/116392-magic-marker-icon-transport-travel-transportation-bicycle.png', // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
      };
      obj.marker = new google.maps.Marker({
        map: googleMap,
        position: {lat: parseFloat(obj.bike.location.latitude), lng: parseFloat(obj.bike.location.longitude)},
        icon: icon,
        customInfo: i
      });
      attachSecretMessage(obj);
      rubikes.push(obj);
    }
  }
  else{
    for(var i=0;i<bikes.length&&i<rubikes.length;i++){
      var bike = bikes[i];
      var myLatlng = new google.maps.LatLng(parseFloat(bike.location.latitude),parseFloat(bike.location.longitude));
      rubikes[i].marker.setPosition(myLatlng);
    }
  }
}

map.setNearestBikePath = function() {
  target = -1;
  var minDis = 200000;
  for(var i=0;i<rubikes.length;i++){
    if(rubikes[i].bike.status=="ok"){
      var dis = google.maps.geometry.spherical.computeDistanceBetween (ownMarker.getPosition(), rubikes[i].marker.getPosition());
      if(dis<minDis){
        target = i;
        minDis = google.maps.geometry.spherical.computeDistanceBetween (ownMarker.getPosition(), rubikes[i].marker.getPosition());
      }
    }
  }
  directionsService.route({
    origin: ownMarker.getPosition(),
    destination: rubikes[target].marker.getPosition(),
    waypoints: [],
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      rubikes[target].marker.setAnimation(google.maps.Animation.BOUNCE);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

map.clearPath = function(){
  directionsDisplay.setDirections({routes: []});
  rubikes[target].marker.setAnimation(null);
  target = -1;
}

function setOriginLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      googleMap.setCenter(initialLocation);
      ownMarker.setPosition(initialLocation);
    });
  }
}
var panorama;
var currentInfowindow;
function attachSecretMessage(obj) {
  $.post('/view',{action:'bikeInfo',json:obj.bike},function (Content) {
    var infowindow = new google.maps.InfoWindow({
      content: Content
    });
    obj.marker.addListener('click', function() {
      if(currentInfowindow!=undefined)currentInfowindow.close();
      infowindow.open(obj.marker.get('map'), obj.marker);
      currentInfowindow = infowindow;
      panorama = googleMap.getStreetView();
      panorama.setPosition({ lat: obj.marker.getPosition().lat(), lng: obj.marker.getPosition().lng()});
      panorama.setPov(({
        heading: 265,
        pitch: 0
      }));
      });
  });
}
var init = -1;
var offset = 0;
function handleOrientation(event) {
  var alpha    = event.alpha;
  if(init==-1)init = alpha;
  else offset = alpha-init;
  var rotate = 'rotate(' + offset + 'deg)';
  $('#compass').css({ 
      '-webkit-transform': rotate,
      '-moz-transform': rotate,
      '-o-transform': rotate,
      '-ms-transform': rotate,
      'transform': rotate 
  });
}

function  main() {
  // body...
  google.maps.event.addDomListener(
  window, 'load', initialize);
  $('#compass').css('top','50%');
  $('#compass').css('left','50%');
  $('#compass').css('margin-top',"-75px");
  $('#compass').css('margin-left',"-75px");
}

main();