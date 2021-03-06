import {map} from '../react/index'

export default class Bike{
  constructor(map,bike,index){
    this.bike = bike;
    this.icon = {
      url: 'http://www.pngmart.com/files/3/Hero-Bike-PNG-Transparent-Image.png', // url
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
    $.post('/viewOfBikeInfo',{action:'bikeInfo',json:this.bike},function (Content) {
      var infowindow = new google.maps.InfoWindow({
        content: Content
      });
      this.marker.addListener('click', function() {
          if(Bike.currentInfowindow!=undefined)Bike.currentInfowindow.close();
          infowindow.open(this.marker.get('map'), this.marker);
          Bike.currentInfowindow = infowindow;
          Bike.panorama = map.googleMap.getStreetView();
          Bike.panorama.setPosition({ lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng()});
          //Bike.panorama.setPosition({ lat: 0.0, lng: 0.0});
          Bike.panorama.setPov(({
            heading: 265,
            pitch: 0
          }));
          $('#streetview').click(()=>{Bike.panorama.setVisible(true);});
          $('#closebut').click(()=>{Bike.currentInfowindow.close();});
        }.bind(this));
    }.bind(this));
  }
}

Bike.panorama = null;
Bike.currentInfowindow = null;