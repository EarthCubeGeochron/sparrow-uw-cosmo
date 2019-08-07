import React, { useState } from "react";
import { render } from "react-dom";
import Map from "./testmap.js";

function Carto() {
  const [markersData, setMarkersData] = useState([
    { latLng: { lat: 0, lng: 0 }, title: 10 }
  ]);

  function addMarker() {
    const lastMarker = markersData[markersData.length - 1];

    setMarkersData([
      ...markersData,
      {
        title: +lastMarker.title + 1,
        latLng: {
          lat: lastMarker.latLng.lat + 0.0001,
          lng: lastMarker.latLng.lng + 0.0001
        }
      }
    ]);
  }

  return (
    <div>
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
render(<Carto />, document.getElementById("map"));
