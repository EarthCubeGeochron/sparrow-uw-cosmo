import React, { useState } from "react";
import { render } from "react-dom";
import Map from "./testmap.js";
import 'leaflet/dist/leaflet.css'

function Carto() {
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 40, lng: -90 }, title: 1 }
  ]);

  function addMarker() {
    const lastMarker = markersData[markersData.length - 1];

    setMarkersData([
      ...markersData,
      {
        title: +lastMarker.title + 1,
        latLng: {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng()
        }
      }
    ]);
  }

  return (
    <div>
      <h2>Shan Ye's Test</h2>
      <h3>(modified by Daven Quinn)</h3>
      <p>Shan Ye's test: Add a leaflet map here:</p>
      <Map markersData={markersData} />
      <button onClick={addMarker}>Add marker</button>
      <ul>
        Markers data:
        {markersData.map(marker => (
          <li key={marker.title}>
            {marker.title}, lat: {marker.latLng.lat}, lng: {marker.latLng.lng},
          </li>
        ))}
      </ul>
    </div>
  );
}


// Draw the map in the html div with an id of map
//render(<Carto />, document.getElementById("map"));

/*
Instead of drawing to the DOM, export the component to be
integrated with the rest of our app. The entire app is "render"ed
only once.
*/
export default Carto;
