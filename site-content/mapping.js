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

class Carto extends React.Component {
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
    var southWest = L.latLng(-85, -200),
    		northEast = L.latLng(85, 200),
    		mybounds = L.latLngBounds(southWest, northEast);
    var data = all_markers
    return (
      <Map
        center={[40,-100]}
        onClick={this.addMarker}
        zoom={5}
        style={style.map}
        //bounds = {mybounds}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
          minZoom = {3}
          bounds = {mybounds}
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
export default Carto;
