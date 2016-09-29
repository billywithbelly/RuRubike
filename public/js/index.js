
import React from 'react'
// import only the render function of react-dom using ES2015 destructuring
import { render } from 'react-dom'
//Motherfucker first letter need Da shit!!
import PlaceBox from './components/place-box'

render(
  <PlaceBox url='/place' />,
  document.getElementById('placeContainer')
)