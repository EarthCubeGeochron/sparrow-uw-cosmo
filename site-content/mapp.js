import React, { Component } from "react";
import {Map, TileLayer, Popup, Marker, withLeaflet} from "react-leaflet";
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import L from "leaflet";
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

var all_markers = []

const style = {
  map: {
    height: '400px',
    width: '100%'
  }
}

class Mapp extends React.Component {
  constructor() {
    super();
    this.state = {
      //currentPos: null,
      markers: []
    };
    // this.handleClick = this.handleClick.bind(this);
  }

  addMarker = (e) => {
    const {markers} = this.state
    const lastMarker = markers[markers.length -1]
    markers.push(e.latlng)
    all_markers.push([markers.length, e.latlng.lat, e.latlng.lng])
    this.setState({markers})
    console.log(JSON.stringify(markers))
    console.log(JSON.stringify(all_markers))
  }

  // handleClick(e){
  //   this.setState({ currentPos: e.latlng });
  // }

  render() {
    var data = all_markers
    return (
      <Map
        center={[40,-100]}
        onClick={this.addMarker}
        zoom={5}
        style={style.map}
        >
        <TileLayer
          attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        />
        {this.state.markers.map((markers, idx) =>
          <Marker key={`marker-${idx}`} position={markers}>
          <Popup>
            <span>{data[idx][1]}, {data[idx][2]}</span>
          </Popup>
        </Marker>
        )}
      </Map>
    );
  }
}
export default Mapp;
