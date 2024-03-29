/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checkss
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React, { Component } from "react";
import Popup2 from "./Popup2";
import h from "react-hyperscript";
import { Map, TileLayer, Popup, Marker, withLeaflet } from "react-leaflet";
import {
  FormGroup,
  InputGroup,
  Intent,
  Switch,
  Alignment,
} from "@blueprintjs/core";
import { DateInput, DatePicker, TimePrecision } from "@blueprintjs/datetime";
import { Button } from "@blueprintjs/core";
import { put } from "axios";
import { StatefulComponent } from "@macrostrat/ui-components";
import ReactJSON from "react-json-view";
import update from "immutability-helper";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

var sub_status = 0;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// a list to host all markers
var all_markers = [];

const style = {
  map: {
    height: "400px",
    width: "100%",
  },
};

var warning_fields = {};
var checked = 0;

function change_status(lat, lon, time, session, sample, input) {
  if (
    lat == null ||
    lon == null ||
    time == null ||
    session == null ||
    sample == null
  ) {
    checked = 0;
    return 0;
  } else {
    checked = 1;
    return 1;
  }
}
// return the real time validation
function getIntent(input, min, max, name) {
  if (input == null) {
    return Intent.PRIMARY;
  } else {
    var data_in = parseFloat(input);
    if (data_in >= min && data_in <= max) {
      if (warning_fields[name] !== undefined) {
        delete warning_fields[name];
      }
      return Intent.SUCCESS;
    } else {
      warning_fields[name] = 1;
      return Intent.WARNING;
    }
  }
}

function sub(this1) {
  //alert('Oh look, an alert!')
  return this1.submitData.bind(this1);
}

class Form extends Component {
  //initializing a component
  constructor(props) {
    // when run the class, also run it for the class that it is extending
    super(props);
    // this.state is @state
    this.state = {
      formData: { sample_text: null },
      validate: 0,
      sub_status: 0,
      // for mapping the markers
      markers: [],
      showPopup: null,
      // for updating
      markers1: { lat: null, lon: null },
    };
  }

  // might be removed later
  getMarkers = (e) => {
    return e.markers;
  };

  // setting up function for markers
  addMarker = (e) => {
    var this_coor;
    console.log("this coor 1: " + this_coor);
    console.log("latlng: " + this.state.markers1);
    const { markers } = this.state;
    const lastMarker = markers[markers.length - 1];
    markers.push(e.latlng);
    all_markers.push([
      markers.length,
      e.latlng.lat.toFixed(5),
      e.latlng.lng.toFixed(5),
    ]);
    // get the lat and lon of this coor
    var new_coor = [
      parseFloat(e.latlng.lat.toFixed(5)),
      parseFloat(e.latlng.lng.toFixed(5)),
    ];
    const newState = update(this.state, {
      //markers:{$set: e.latlng},
      formData: {
        ["lat"]: { $set: e.latlng.lat.toFixed(5) },
        ["lon"]: { $set: e.latlng.lng.toFixed(5) },
      },
      markers1: {
        ["lat"]: { $set: e.latlng.lat.toFixed(5) },
        ["lon"]: { $set: e.latlng.lng.toFixed(5) },
      },
    });
    this.setState(newState);
    this_coor = [e.latlng.lat.toFixed(5), e.latlng.lng.toFixed(5)];
    console.log("this coor:" + this_coor);
    return this_coor;
  };

  render() {
    // Map setup
    var southWest = L.latLng(-85, -200),
      northEast = L.latLng(85, 200),
      mybounds = L.latLngBounds(southWest, northEast);
    //update every key into the json view
    // update the state in the form by the name of keys
    const updater = (key) => {
      return (event) => {
        if (key == "lat" || key == "lon") {
          const newState = update(this.state, {
            formData: { [key]: { $set: event.target.value } },
            // if it is lat and lon, also update markers1
            markers1: { [key]: { $set: event.target.value } },
          });
          return this.setState(newState);
        } else {
          const newState = update(this.state, {
            formData: { [key]: { $set: event.target.value } },
          });
          return this.setState(newState);
        }
        // update marker []
        //all_markers = [this.state.markers]
      };
    };

    const form_coordinate = () => {
      return (event) => {
        if (
          this.state.markers1.lat != null ||
          this.state.markers1.lon != null
        ) {
          var new_coor = [
            parseFloat(this.state.markers1.lat),
            parseFloat(this.state.markers1.lon),
          ];
          all_markers.push([
            this.state.markers.length,
            parseFloat(this.state.markers1.lat),
            parseFloat(this.state.markers1.lon),
          ]);
          data.push(new_coor);
        }
      };
    };

    const toggleChecked = (lat, lon, time, session, sample, checked) => {
      return change_status(lat, lon, time, session, sample, checked);
    };

    var data = all_markers;

    return h("div.form+map", [
      h("h1", "The 10Be Data Submission Form"),
      <Map
        center={[40, -100]}
        onClick={this.addMarker}
        zoom={5}
        style={style.map}
        //bounds = {mybounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
          minZoom={3}
          bounds={mybounds}
        />
        {this.state.markers.map((markers, idx) => (
          <Marker key={`marker-${idx}`} position={markers}>
            <Popup>
              <span>
                {data[idx][1]}, {data[idx][2]}
              </span>
            </Popup>
          </Marker>
        ))}
      </Map>,
      h("div.shan-form", [
        console.log("popup: " + this.state.showPopup),
        console.log("this coor 2: " + this.state.markers),
        console.log(this.state.formData),
        console.log(Object.keys(this.state.formData).length),
        console.log(warning_fields),

        h("h2", "Sample location"),
        h(
          FormGroup,
          {
            helperText: "-90 to 90 degrees",
            label: "Latitude",
          },
          [
            h(InputGroup, {
              id: "lat-text-input",
              placeholder: "Lat value",
              value: this.state.formData.lat,
              onChange: updater("lat"),
              intent: getIntent(this.state.formData.lat, -90, 90, "lat"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "-180 to 180 degrees",
            label: "Longitude",
          },
          [
            h(InputGroup, {
              id: "lon-text-input",
              placeholder: "Lon value",
              value: this.state.formData.lon,
              onChange: updater("lon"),
              intent: getIntent(this.state.formData.lon, -180, 180, "lon"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "General location. e.g. Northern Wisconsin",
            label: "Location Name",
          },
          [
            h(InputGroup, {
              id: "location-text-input",
              placeholder: "Location",
              value: this.state.formData.location,
              onChange: updater("location"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "in meters",
            label: "Elevation",
          },
          [
            h(InputGroup, {
              id: "elevation-text-input",
              placeholder: "Elevation value",
              value: this.state.formData.elevation,
              onChange: updater("elevation"),
            }),
          ]
        ),
        h("h3", "Date of collecting"),
        h(DatePicker, {
          value: this.state.formData.calendarDate,
          onChange: (result) => {
            const newState = update(this.state, {
              formData: { calendarDate: { $set: result } },
            });
            return this.setState(newState);
          },
        }),
        h("h2", "General information of the sample"),

        h(
          FormGroup,
          {
            helperText: "Enter the import name. Leave it blank if NA",
            label: "Import Name",
          },
          [
            h(InputGroup, {
              id: "import_name",
              placeholder: "Import Name",
              value: this.state.formData.import_name,
              onChange: updater("import_name"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Enter the session index.",
            label: "Session",
          },
          [
            h(InputGroup, {
              id: "session-index-text-input",
              placeholder: "Session index",
              value: this.state.formData.session_index,
              onChange: updater("session_index_text"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Enter the analysis name",
            label: "Analysis name",
          },
          [
            h(InputGroup, {
              id: "analysis-name-text-input",
              placeholder: "Analysis name text",
              value: this.state.formData.analysis_name,
              onChange: updater("analysis_text"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "E.g. PBS-04-05",
            label: "Sample",
          },
          [
            h(InputGroup, {
              id: "sample-text-input",
              placeholder: "Sample name text",
              value: this.state.formData.sample_text,
              onChange: updater("sample_text"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Recommannded Sample Unique ID based on aurthor's name and publication year. E.g. Marc2010-01",
            label: "Sample ID",
          },
          [
            h(InputGroup, {
              id: "sample-id-input",
              placeholder: "Sample ID",
              value: this.state.formData.sample_id,
              onChange: updater("sample_id")
            }),
          ]
        ),
        h("h2", "Sample analysis"),
        h(
          FormGroup,
          {
            helperText: "Shielding factor: 0-1",
            label: "Shielding",
          },
          [
            h(InputGroup, {
              id: "shielding-text-input",
              placeholder: "Shielding value",
              value: this.state.formData.shielding,
              onChange: updater("shielding"),
              intent: getIntent(
                this.state.formData.shielding,
                0,
                1,
                "shielding"
              ),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "thickness in cm",
            label: "Thickness",
          },
          [
            h(InputGroup, {
              id: "thickness-text-input",
              placeholder: "Thickness",
              value: this.state.formData.thickness,
              onChange: updater("thickness"),
              intent: getIntent(
                this.state.formData.thickness,
                0,
                1e10,
                "thickness"
              ),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "borehole depth in meters",
            label: "Depth",
          },
          [
            h(InputGroup, {
              id: "depth-text-input",
              placeholder: "Depth",
              value: this.state.formData.depth,
              onChange: updater("depth"),
              intent: getIntent(this.state.formData.depth, 0, 1e10, "depth"),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "boulder height in cm",
            label: "Boulder Height",
          },
          [
            h(InputGroup, {
              id: "boulder-height-text-input",
              placeholder: "Boulder Height",
              value: this.state.formData.boulder_height,
              onChange: updater("boulder height"),
              intent: getIntent(
                this.state.formData.boulder_height,
                0,
                500,
                "boulder height"
              ),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "density in g/cm3",
            label: "Density",
          },
          [
            h(InputGroup, {
              id: "density-text-input",
              placeholder: "Density",
              value: this.state.formData.density,
              onChange: updater("density"),
              intent: getIntent(
                this.state.formData.density,
                0,
                5,
                "density"
              ),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "Atmospheric pressure in hPa",
            label: "Atmospheric pressure",
          },
          [
            h(InputGroup, {
              id: "atm_pressure-text-input",
              placeholder: "Pressure",
              value: this.state.formData.atm_pressure,
              onChange: updater("atm_pressure"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "Three-letter string: std, pre, or ant",
            label: "Pressure handling flag",
          },
          [
            h(InputGroup, {
              id: "atm_pressure-text-input",
              placeholder: "Pressure handling flag",
              value: this.state.formData.pressure_flag,
              onChange: updater("pressure_flag"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "E.g. boulder",
            label: "Sample material type",
          },
          [
            h(InputGroup, {
              id: "sample-type-text-input",
              placeholder: "Sample material type",
              value: this.state.formData.sample_type,
              onChange: updater("sample_type"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "E.g. Quartz",
            label: "Mineral type",
          },
          [
            h(InputGroup, {
              id: "mineral-type-text-input",
              placeholder: "Mineral type",
              value: this.state.formData.mineral_type,
              onChange: updater("mineral"),
              intent: Intent.PRIMARY,
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: "0-200 grams",
            label: "Mineral weight",
          },
          [
            h(InputGroup, {
              id: "mineral-text-input",
              placeholder: "Mineral weight",
              value: this.state.formData.mineral,
              onChange: updater("mineral"),
              intent: getIntent(this.state.formData.mineral, 0, 200, "mineral"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "0-5000 micrograms",
            label: "9Be Carrier Weight",
          },
          [
            h(InputGroup, {
              id: "9be-text-input",
              placeholder: "9Be",
              value: this.state.formData._9Be,
              onChange: updater("_9Be"),
              intent: getIntent(this.state.formData._9Be, 0, 5000, "9Be"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Usually between 1E-10 and 1E-20",
            label: "10Be/9Be",
          },
          [
            h(InputGroup, {
              id: "be-ratio-text-input",
              placeholder: "10Be/9Be value",
              value: this.state.formData.Be_ratio,
              onChange: updater("Be_ratio"),
              intent: getIntent(
                this.state.formData.Be_ratio,
                0.0000000000000000001,
                0.000000001,
                "10Be/9Be"
              ),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Usually betweenn 1E-10 and 1E-20",
            label: "1 Sigma",
          },
          [
            h(InputGroup, {
              id: "1sig-text-input",
              placeholder: "1-sigma value",
              value: this.state.formData._1_sigma,
              onChange: updater("_1_sigma"),
              intent: getIntent(
                this.state.formData._1_sigma,
                0.0000000000000000001,
                0.000000001,
                "1sigma"
              ),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "0 to 1E-9 atoms/g",
            label: "10Be Concentration",
          },
          [
            h(InputGroup, {
              id: "10be-text-input",
              placeholder: "10Be value",
              value: this.state.formData._10Be,
              onChange: updater("_10Be"),
              intent: getIntent(
                this.state.formData._10Be,
                0,
                0.00000001,
                "10Be"
              ),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "0 to 1E-10, atoms/g",
            label: "10Be concentration uncertainty",
          },
          [
            h(InputGroup, {
              id: "uncertainty-text-input",
              placeholder: "Uncertainty value",
              value: this.state.formData.uncertainty,
              onChange: updater("uncertainty"),
              intent: getIntent(
                this.state.formData.uncertainty,
                0,
                0.000000001,
                "uncertainty"
              ),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "10Be age in ka. Usually under 5000.",
            label: "10Be Age",
          },
          [
            h(InputGroup, {
              id: "10be-age-text-input",
              placeholder: "Age value",
              value: this.state.formData.age,
              onChange: updater("age"),
              intent: getIntent(this.state.formData.age, 0, 5000, "age"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "10Be age uncertainty in ka.",
            label: "10Be Age Uncertainty",
          },
          [
            h(InputGroup, {
              id: "10be-age-unc-text-input",
              placeholder: "Age Uncertainty",
              value: this.state.formData.age_unc,
              onChange: updater("age_unc"),
              intent: getIntent(this.state.formData.age_unc, 0, 5000, "age_unc"),
            }),
          ]
        ),
        h("h2", "Lab information"),
        h(
          FormGroup,
          {
            helperText: "E.g. WiscCosmo",
            label: "Lab name",
          },
          [
            h(InputGroup, {
              id: "lab_name-text-input",
              placeholder: "Lab name",
              value: this.state.formData.lab_name,
              onChange: updater("lab_name"),
            }),
          ]
        ),

        h(
          FormGroup,
          {
            helperText: 'E.g. 07KNSTD. Refer to <a href = "http://hess.ess.washington.edu/math/docs/al_be_v22/standard_names.html"> this page </a>',
            label: "AMS standardization",
          },
          [
            h(InputGroup, {
              id: "lab_std-text-input",
              placeholder: "Lab standard",
              value: this.state.formData.lab_std,
              onChange: updater("lab_std"),
            }),
          ]
        ),
        h("h3", "Lab date"),
        h(DatePicker, {
          value: this.state.formData.lab_date,
          onChange: (result) => {
            const newState = update(this.state, {
              formData: { lab_date: { $set: result } },
            });
            return this.setState(newState);
          },
        }),
        h("h3", "Embargo date"),
        h(DatePicker, {
          value: this.state.formData.embargo_date,
          onChange: (result) => {
            const newState = update(this.state, {
              formData: { embargo_date: { $set: result } },
            });
            return this.setState(newState);
          },
        }),

        h(
          FormGroup,
          {
            helperText: "Enter additional information",
            label: "Notes",
          },
          [
            h(InputGroup, {
              id: "notes-text-input",
              placeholder: "Notes or comments",
              value: this.state.formData.notes,
              onChange: updater("notes"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Enter the compilation source",
            label: "Compilation",
          },
          [
            h(InputGroup, {
              id: "compilation-text-input",
              placeholder: "Compilation",
              value: this.state.formData.compilation,
              onChange: updater("compilation"),
            }),
          ]
        ),
        h(
          FormGroup,
          {
            helperText: "Enter the original reference",
            label: "Reference",
          },
          [
            h(InputGroup, {
              id: "ref-text-input",
              placeholder: "Reference",
              value: this.state.formData.reference,
              onChange: updater("reference"),
            }),
          ]
        ),
        h("h2", "Validating"),
        h("h3", "Data preview"),
        h(ReactJSON, { src: this.state.formData }),
        h(
          "p",
          "Empty field(s): " +
            (30 - Object.keys(this.state.formData).length).toString()
        ),
        h(
          "p",
          "Invalid field(s): " + Object.keys(warning_fields).length.toString()
        ),
        //h('p',  'Submission: ' + sub_status.toString()),
        //h('p', 'popup: ' + this.state.showPopup.toString()),
        h(Switch, {
          disabled:
            this.state.formData.lat == null ||
            this.state.formData.lon == null ||
            this.state.formData.calendarDate == null ||
            this.state.formData.session_index_text == null ||
            this.state.formData.sample_text == null,
          label:
            "Have all required fields: lat, lon, date, sample name, session.",
          defaultChecked: false,
          //checked: checked,
          checked: toggleChecked(
            this.state.formData.lat,
            this.state.formData.lon,
            this.state.formData.calendarDate,
            this.state.formData.session_index_text,
            this.state.formData.sample_text,
            checked
          ),
          //onChange: toggleChecked(this.state.formData.lat, this.state.formData.lon, this.state.formData.calendarDate,checked),
          innerLabelChecked: "Yes",
          innerLabel: "No",
          alignIndicator: Alignment.RIGHT,
          inline: true,
        }),
        console.log(checked.toString() + " check"),
        h("p", ""),
        h(Button, {
          disabled: checked == 0,
          text: "Submit",
          onClick: () => {
            this.submitData(this), alert("Successful!");
          },
        }),
        h(Button, {
          text: "Clear",
          onClick: () => {
            window.location.reload(false);
          },
        }),
        console.log("sub_status: " + this.state.sub_status),
      ]),
    ]);
  }

  async submitData() {
    //@ ref to right value "=>" instead of "->"
    var lat_data,
      lon_data,
      atm_pressure,
      thickness,
      depth,
      uncertainty_data,
      session_index_data,
      age_data,
      age_unc_data,
      shielding_data,
      elevation_data,
      sigma_data,
      mineral_data,
      _9Be_data,
      _10Be_data,
      density,
      boulder_height,
      ratio_Be_data;

    lat_data = parseFloat(this.state.formData.lat);
    lon_data = parseFloat(this.state.formData.lon);

    if (lon_data > 180){
      while (lon_data > 180){
        lon_data -= 360;
      }
    } else if (lon_data < -180) {
      while (lon_data < -180){
        lon_data += 360;
      }
    }


    if (this.state.formData.elevation == null) {
      elevation_data = -999;
    } else {
      elevation_data = parseFloat(this.state.formData.elevation);
    }

    if (this.state.formData.session_index == null) {
      session_index_data = -999;
    } else {
      session_index_data = parseFloat(this.state.formData.session_index);
    }

    if (this.state.formData.age == null) {
      age_data = -999;
    } else {
      age_data = parseFloat(this.state.formData.age);
    }

    if (this.state.formData.age_unc == null) {
      age_unc_data = -999;
    } else {
      age_unc_data = parseFloat(this.state.formData.age_unc);
    }

    if (this.state.formData.uncertainty == null) {
      uncertainty_data = -999;
    } else {
      uncertainty_data = parseFloat(this.state.formData.uncertainty);
    }

    if (this.state.formData._1_sigma == null) {
      sigma_data = -999;
    } else {
      sigma_data = parseFloat(this.state.formData._1_sigma);
    }

    if (this.state.formData.boulder_height == null) {
      boulder_height = -999;
    } else {
      boulder_height = parseFloat(this.state.formData.boulder_height);
    }

    if (this.state.formData.shielding == null) {
      shielding_data = -999;
    } else {
      shielding_data = parseFloat(this.state.formData.shielding);
    }

    if (this.state.formData.mineral == null) {
      mineral_data = -999;
    } else {
      mineral_data = parseFloat(this.state.formData.mineral);
    }

    if (this.state.formData._9Be == null) {
      _9Be_data = -999;
    } else {
      _9Be_data = parseFloat(this.state.formData._9Be);
    }

    if (this.state.formData._10Be == null) {
      _10Be_data = -999;
    } else {
      _10Be_data = parseFloat(this.state.formData._10Be);
    }

    if (this.state.formData.Be_ratio == null) {
      ratio_Be_data = -999;
    } else {
      ratio_Be_data = parseFloat(this.state.formData.Be_ratio);
    }

    if (this.state.formData.density == null) {
      density = -999;
    } else {
      density = parseFloat(this.state.formData.density);
    }

    if (this.state.formData.atm_pressure == null) {
      atm_pressure = -999;
    } else {
      atm_pressure = parseFloat(this.state.formData.atm_pressure);
    }

    if (this.state.formData.thickness == null) {
      thickness = -999;
    } else {
      thickness = parseFloat(this.state.formData.thickness);
    }

    if (this.state.formData.depth == null) {
      depth = -999;
    } else {
      depth = parseFloat(this.state.formData.depth);
    }

    console.log("placeholder");

    const sessionData = {
      date: this.state.formData.calendarDate,
      name: this.state.formData.import_name,
      sample: {
        name: this.state.formData.sample_text,
        lab_name: this.state.formData.lab_name,
        lab_date: this.state.formData.lab_date,
        ams_standard: this.state.formData.lab_std,
        embargo_date: this.state.formData.embargo_date,
        compile: this.state.formData.compilation,
        reference: this.state.formData.reference,
        mineral_type: this.state.formData.mineral_type,
        elevation: elevation_data,
        sample_type: sample_type,
        boulder_height: boulder_height,
        location_name: this.state.formData.location,
        location: {
          type: "Point",
          coordinates: [lon_data, lat_data],
        },
        atm_pressure: atm_pressure,
        pressure_flag: pressure_flag,
        // thickness: thickness,
        // depth: depth,
      },
      analysis: [
        {
          // Can't seem to get or create this instance from the database
          analysis_type: this.state.formData.analysis_name,
          session_index: this.state.formData.session_index,
          datum: [
            {
              value: density,
              error: null,
              type: {
                parameter: "Density",
                unit: "g/cm^3",
              },
            },
            {
              value: thickness,
              error: null,
              type: {
                parameter: "Thickness",
                unit: "cm",
              },
            },
            {
              value: _10Be_data,
              error: uncertainty_data,
              type: {
                parameter: "10Be",
                unit: "atoms/g",
              },
            },
            {
              value: ratio_Be_data,
              error: null,
              type: {
                parameter: "10Be/9Be",
                unit: "none",
              },
            },
            {
              value: age_data,
              error: age_unc_data,
              type: {
                parameter: "10Be Age",
                unit: "ka",
              },
            },
            {
              value: shielding_data,
              error: null,
              type: {
                parameter: "Sheilding",
                unit: "none",
              },
            },
            {
              value: mineral_data,
              error: null,
              type: {
                parameter: "Mineral weight",
                unit: "none",
              },
            },
            {
              value: sigma_data,
              error: null,
              type: {
                parameter: "1 Sigma",
                unit: "none",
              },
            },
          ],
        },
      ],
    };

    //A function that removes null datums
    let datums = [...sessionData.analysis.datum]

    let newDatums = datums.filter(datum => datum.value != null) // returns datums where value is NOT NULL
    sessionData.analysis.datums = newDatums

    const data = {
      filename: null,
      data: sessionData,
    };

    console.log(JSON.stringify(data));
    try {
      const res = await put("/api/v2/import-data/models/session", data);
      return console.log(res);
    } catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  }
}

export default Form;
