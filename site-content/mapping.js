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

class addMarkerClass{
  constructor() {
    //super();
    this.state = {
      //currentPos: null,
      markers: []
    };
    // this.handleClick = this.handleClick.bind(this);
  }
  addMarker=(e)=>{
    var this_coor;
    console.log('this coor 1: ' +this_coor);
    const {markers} = this.state;
    const lastMarker = markers[markers.length -1];
    markers.push(e.latlng);
    all_markers.push([markers.length, e.latlng.lat, e.latlng.lng]);
    this.setState({markers});
    console.log(JSON.stringify(markers));
    console.log(JSON.stringify(all_markers));
    this_coor = all_markers[all_markers.length - 1];
    console.log('this coor:' +this_coor);
    return this_coor;
  }
}


class Carto extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     //currentPos: null,
  //     markers: []
  //   };
  //   // this.handleClick = this.handleClick.bind(this);
  // }
  constructor(thisadd = new addMarkerClass())  {
    this.add = thisadd;
  }

  // addMarker = (e) => {
  //   const {markers} = this.state
  //   const lastMarker = markers[markers.length -1]
  //   markers.push(e.latlng)
  //   all_markers.push([markers.length, e.latlng.lat, e.latlng.lng])
  //   this.setState({markers})
  //   console.log(JSON.stringify(markers))
  //   console.log(JSON.stringify(all_markers))
  //   this_coor = all_markers[all_markers.length - 1]
  //   console.log('this coor ' +this_coor);
  // }

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
        onClick={this.add.addMarker}
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
        {this.add.state.markers.map((markers, idx) =>
          <Marker key={`marker-${idx}`} position={markers}>
          //{this_coor = [data[idx][1],data[idx][2]]}
          <Popup>
            <span>{data[idx][1]}, {data[idx][2]}</span>
          </Popup>
        </Marker>
        )}
      </Map>
    );
  }
}

export {Carto, addMarkerClass};
//export this_coor;
