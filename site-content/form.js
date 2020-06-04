/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from 'react-hyperscript';
import {FormGroup, InputGroup} from '@blueprintjs/core';
import { DateInput, DatePicker, TimePrecision } from "@blueprintjs/datetime";
import {Button} from '@blueprintjs/core';
import {put} from 'axios';
import {Component} from 'react';
import {StatefulComponent} from '@macrostrat/ui-components';
import ReactJSON from 'react-json-view';
import update from 'immutability-helper';

class Form extends Component {
  //initializing a component
  constructor(props) {
    // when run the class, also run it for the class that it is extending
    super(props);
    // this.state is @state
    this.state = {
      formData: {
        sample_text: null
      }
    };
  }

  render() {

    //update every key into the json view
    const updater = key => { return event => {
      const newState = update(this.state, {formData:{[key]:{$set: event.target.value}}});
      return this.setState(newState);
    }; };


    return h('div.shan-form', [
      h('h1', '10Be Sample Data Input Form'),
      h('h2', 'General information of the sample'),
      h(ReactJSON, {src: this.state.formData}),


        h(FormGroup, {
          helperText: 'Enter the import name. Leave it blank if NA',
          label: 'Import Name'
        }, [
          h(InputGroup, {
            id: 'import_name',
            placeholder: 'Import Name',
            value: this.state.formData.import_name,
            onChange: updater('import_name')
          })
        ]),
      h(FormGroup, {
        helperText: 'Enter the sample name',
        label: 'Sample'
      }, [
        h(InputGroup, {
          id: 'sample-text-input',
          placeholder: 'Sample text',
          value: this.state.formData.sample_text,
          onChange: updater('sample_text')
        })
      ]),
      h(FormGroup, {
        helperText: 'Enter the sample id',
        label: 'Sample ID'
      }, [
        h(InputGroup, {
          id: 'sample-id-input',
          placeholder: 'Sample ID',
          value: this.state.formData.sample_id,
          onChange: updater('sample_id')
        })
      ]),
      h('h2','Sample location'),
      h(FormGroup, {
        helperText: '-90 to 90 degrees',
        label: 'Latitude'
      }, [
        h(InputGroup, {
          id: 'lat-text-inout',
          placeholder: 'Lat value',
          value: this.state.formData.lat,
          onChange: updater('lat')
        })
      ]),
      h(FormGroup, {
        helperText: '-180 to 180 degrees',
        label: 'Longitude'
      }, [
        h(InputGroup, {
          id: 'lon-text-inout',
          placeholder: 'Lon value',
          value: this.state.formData.lon,
          onChange:updater('lon')})
      ]),
      h(FormGroup, {
        helperText: 'General location. e.g. Northern Wisconsin',
        label: 'Location Name'
      }, [
        h(InputGroup, {
          id: 'location-text-inout',
          placeholder: 'Location',
          value: this.state.formData.location,
          onChange: updater('location')
        })
      ]),
      h(FormGroup, {
        helperText: 'in meters',
        label: 'Elevation'
      }, [
        h(InputGroup, {
          id: 'elevation-text-inout',
          placeholder: 'Elevation value',
          value: this.state.formData.elevation,
          onChange: updater('elevation')
        })
      ]),
      h('h2', 'Date of collecting'),
      h(DatePicker,{
        //defaultValue: {today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()},
        //todayButtonText: 'today',
        value:this.state.formData.calendarDate,
        onChange: result => {
          const newState = update(this.state, {formData: {calendarDate: {$set: result}}});
          return this.setState(newState);
        }
      }),
      h('h2', 'Sample analysis'),
      h(FormGroup, {
        helperText: '0-1',
        label: 'Shielding'
      }, [
        h(InputGroup, {
          id: 'shielding-text-inout',
          placeholder: 'Shielding value',
          value: this.state.formData.shielding,
          onChange: updater('shielding')
        })
      ]),
      h(FormGroup, {
        helperText: '0-100',
        label: 'Quartz'
      }, [
        h(InputGroup, {
          id: 'quartz-text-inout',
          placeholder: 'Quartz value',
          value: this.state.formData.quartz,
          onChange: updater('quartz')
        })
      ]),
      h(FormGroup, {
        helperText: '0-500',
        label: '9Be Carrier'
      }, [
        h(InputGroup, {
          id: '9be-text-inout',
          placeholder: '9Be',
          value: this.state.formData._9Be,
          onChange: updater('_9Be')
        })
      ]),
      h(FormGroup, {
        helperText: '1E-10 to 1E-20',
        label: '10Be/9Be'
      }, [
        h(InputGroup, {
          id: 'be-ratio-text-inout',
          placeholder: '10Be/9Be value',
          value: this.state.formData.Be_ratio,
          onChange: updater('Be_ratio')
        })
      ]),
      h(FormGroup, {
        helperText: '1E-10 to 1E-20',
        label: '1 Sigma'
      }, [
        h(InputGroup, {
          id: '1sig-text-inout',
          placeholder: '1-sigma value',
          value: this.state.formData._1_sigma,
          onChange: updater('_1_sigma')
        })
      ]),
      h(FormGroup, {
        helperText: '0 to 1E-10, atoms/g',
        label: '10Be'
      }, [
        h(InputGroup, {
          id: '10be-text-inout',
          placeholder: '10Be value',
          value: this.state.formData._10Be,
          onChange: updater('_10Be')
        })
      ]),
      h(FormGroup, {
        helperText: '0 - 700 ka',
        label: '10Be Age'
      }, [
        h(InputGroup, {
          id: '10be-age-text-inout',
          placeholder: 'Age value',
          value: this.state.formData.age,
          onChange: updater('age')
        })
      ]),
      h(FormGroup, {
        helperText: '0 to 1E-10, atoms/g',
        label: 'Uncertainty'
      }, [
        h(InputGroup, {
          id: 'uncertainty-text-inout',
          placeholder: 'Uncertainty value',
          value: this.state.formData.uncertainty,
          onChange: updater('uncertainty')
        })
      ]),
      h(FormGroup, {
        helperText: 'Enter additional information',
        label: 'Notes'
      }, [
        h(InputGroup, {
          id: 'notes-text-inout',
          placeholder: 'Notes or comments',
          value: this.state.formData.notes,
          onChange: updater('notes')
        })
      ]),
      h(Button, {
        disabled: (this.state.formData.lat == null) || (this.state.formData.lon == null),
        text: 'Submit',
        onClick: this.submitData.bind(this)
        //icon: 'document'
      })
    ]);
  }

    //var lat_data, lon_data, age_data, uncertainty_data

    //lat_data = parseFloat(@state.formData.lat)
    //lon_data = parseFloat(@state.formData.lon)
    //age_data = parseFloat(@state.formData.age)
    //uncertainty_data = parseFloat(@state.formData.uncertainty)

  async submitData() { //@ ref to right value "=>" instead of "->"
    console.log("placeholder");

    const sessionData = {
      "date": this.state.formData.calendarDate,
      "name": this.state.formData.import_name,
      "sample": {
          "name": this.state.formData.sample_text
      },
      "coordinate":[{
        "lat": this.state.formData.lat,
        "lon": this.state.formData.lon,
      }],
      "analysis": [{
          "analysis_type": {
              "id":  this.state.formData.id
          },
          "session_index": this.state.formData.session_index,
          "datum": [{
              "value": this.state.formData.age,
              "error": this.state.formData.uncertainty,
              "type": {
                  "parameter": {
                      "id": "soil water content"
                  },
                  "unit": {
                      "id": "weight %"
                  }
              }
          }],
          "shielding": this.state.formData.shielding,
          "quartz": this.state.formData.quartz,
          "9Be": this.state.formData._9Be,
          "10Be": this.state.formData._10Be,
          "10Be/9Be": this.state.formData.Be_ratio,
          "1 sigma": this.state.formData._1_sigma,
          "notes": this.state.formData.notes
      }]
    };

    const data = {
      filename: null,
      data: sessionData
    };
    console.log(data);
    const res = await put("/api/v1/import-data/session", data);
    return console.log(res);
  };
}

export default Form;
