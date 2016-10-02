import React from 'react'
import { render } from 'react-dom'
import Map from '../map/map'
import Socket from '../socket/socket'
import UI from '../components/UI'

var ui;
var map;
var socket;
var panorama = null;
var currentInfowindow = null;
function initialize() {
	map = new Map('googleMapDiv');
	socket = new Socket(map);
	ui = render(
		<UI />,
		document.getElementById('app')
	);
}



google.maps.event.addDomListener(
  window, 'load', initialize);

export {map,ui};