import React, { useEffect, useRef } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-icon.png';

// We have to do some surgery to get images in styles to work...
// Fix described in https://github.com/PaulLeCam/react-leaflet/issues/255
// We could use react-leaflet instead of leaflet directly, which would solve
// a lot of these integration issues.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl
});

// This style mostly takes the place of our custom css
const style = {
  width: "100%",
  height: "500px"
};

function Map({ markersData }) {
  // Initiating the map
  const mapRef = useRef(null);
  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [40,-90],
      zoom: 4,
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
