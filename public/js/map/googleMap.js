class Bike{
  constructor(map,bike,index){
    this.bike = bike;
    this.icon = {
      url: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-transport-travel/116392-magic-marker-icon-transport-travel-transportation-bicycle.png', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
    };
    this.marker = new google.maps.Marker({
      map: map.googleMap,
      position: {lat: parseFloat(bike.location.latitude), lng: parseFloat(bike.location.longitude)},
      icon: this.icon,
      customInfo: this.index
    });
    this.attachSecretMessage = this.attachSecretMessage.bind(this);
  }

  attachSecretMessage() {
    $.post('/view',{action:'bikeInfo',json:this.bike},function (Content) {
      var infowindow = new google.maps.InfoWindow({
        content: Content
      });
      this.marker.addListener('click', function() {
        if(currentInfowindow!=undefined)currentInfowindow.close();
        infowindow.open(this.marker.get('map'), this.marker);
        currentInfowindow = infowindow;
        panorama = map.googleMap.getStreetView();
        panorama.setPosition({ lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng()});
        panorama.setPov(({
          heading: 265,
          pitch: 0
        }));
        }.bind(this));
    }.bind(this));
  }
}

class Person{
  constructor(map){
    this.icon = {
      url: 'https://freeiconshop.com/files/edd/person-flat.png', // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
    };
    this.marker = new google.maps.Marker({
      map:map.googleMap,
      position:{ lat: 24.792081, lng: 120.992631},
      icon: this.icon
    });
    this.setPosition = this.setPosition.bind(this);
    this.getPosition = this.getPosition.bind(this);
  }

  setPosition(initialLocation){
    this.marker.setPosition(initialLocation);
  }

  getPosition(){
    return this.marker.getPosition();
  }
}

class Directions{
  constructor(map,color){
    this.service = new google.maps.DirectionsService;
    this.display = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: color
      }
    });
    this.display.setMap(map.googleMap);
    this.findPath = this.findPath.bind(this);
    this.clearPath = this.clearPath.bind(this);
  }

  findPath(origin,destination,callback){
    this.service.route({
      origin: origin,
      destination: destination,
      waypoints: [],
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        this.display.setDirections(response);
        callback();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }.bind(this));
  }

  clearPath(){
    this.display.setDirections({routes: []});
  }
}

class Map{

  constructor(){
    this.target = -1;
    this.mapOptions = {
      center: { lat: 24.792081, lng: 120.992631},
      zoom: 18,
      disableDefaultUI: true
    };
    this.rubikes = [];
    this.googleMap = new google.maps.Map(
      document.getElementById('googleMapDiv'),
    this.mapOptions);;
    this.person = new Person(this);
    this.bikeDirections = new Directions(this,'blue');
    this.placeDirections = new Directions(this,'red');
    this.lockMove = this.lockMove.bind(this);
    this.unLockMove = this.unLockMove.bind(this);
    this.setOriginLocation = this.setOriginLocation.bind(this);
    this.setBikes = this.setBikes.bind(this);
    this.setNearestBikePath = this.setNearestBikePath.bind(this);
    this.clearPath = this.clearPath.bind(this);
    this.findPlacePath = this.findPlacePath.bind(this);
    this.clearPlacePath = this.clearPlacePath.bind(this);
  }

  lockMove() {
    this.googleMap.setOptions({draggable: false});
  }

  unLockMove() {
    this.googleMap.setOptions({draggable: true});
  }

  setOriginLocation() {
    setOriginLocation();
  }

  setBikes(bikes) {
    if(this.rubikes.length==0){
      for(var i=0;i<bikes.length;i++){
        var obj = new Bike(this,bikes[i],i);
        obj.attachSecretMessage();
        this.rubikes.push(obj);
      }
    }
    else{
      for(var i=0;i<bikes.length&&i<this.rubikes.length;i++){
        var bike = bikes[i];
        var myLatlng = new google.maps.LatLng(parseFloat(bike.location.latitude),parseFloat(bike.location.longitude));
        this.rubikes[i].marker.setPosition(myLatlng);
      }
    }
  }

  setNearestBikePath() {
    this.target = -1;
    var minDis = 200000;
    for(var i=0;i<this.rubikes.length;i++){
      if(this.rubikes[i].bike.state=='1'){
        var dis = google.maps.geometry.spherical.computeDistanceBetween (this.person.getPosition(), this.rubikes[i].marker.getPosition());
        if(dis<minDis){
          this.target = i;
          minDis = google.maps.geometry.spherical.computeDistanceBetween (this.person.getPosition(), this.rubikes[i].marker.getPosition());
        }
      }
    }
    this.bikeDirections.findPath(this.person.getPosition(),this.rubikes[this.target].marker.getPosition(),function(){
      this.rubikes[this.target].marker.setAnimation(google.maps.Animation.BOUNCE);
    }.bind(this));
  }

  clearPath(){
    this.bikeDirections.clearPath();
    this.rubikes[this.target].marker.setAnimation(null);
    this.target = -1;
  }

  findPlacePath(lat,lng) {
    this.placeDirections.findPath(this.person.getPosition(),{ lat: lat, lng: lng},function(){
    });
  }

  clearPlacePath(){
    this.placeDirections.clearPath();
  }

}

var map;
var panorama = null;
var currentInfowindow = null;
function initialize() {
  map = new Map();
  setOriginLocation();
}

function setOriginLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.googleMap.setOptions({
        zoom: 18
      });
      map.googleMap.setCenter(initialLocation);
      map.person.setPosition(initialLocation);
    });
  }
}

function  main() {
  // body...
  google.maps.event.addDomListener(
  window, 'load', initialize);
}

main();

