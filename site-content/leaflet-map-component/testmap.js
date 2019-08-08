import React, { useEffect, useRef } from "react";
import L from "leaflet";

const style = {
  width: "100%",
  height: "300px"
};

function Map({ markersData }) {
  // Initiating the map
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [0,0],
      zoom: 10,
      layers: [
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 15,
          minZoom: 3,
          attribution:'Tile Map &copy; Esri'
        })
      ]
    });
  }, []);

  // adding a layer
  const layerRef = useRef(null);
  useEffect(() => {
    layerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  // adding the marker
  useEffect(
    () => {
      layerRef.current.clearLayers();
      markersData.forEach(marker => {
        L.marker(marker.latLng, { title: marker.title }).addTo(
          layerRef.current
        );
      });
    },
    [markersData]
  );
  // put the map to the div with an id of "map"
  return <div id="map" style={style} />;
}

export default Map;
