export default class Bike{
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