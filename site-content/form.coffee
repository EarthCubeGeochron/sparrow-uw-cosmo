import h from 'react-hyperscript'
import {FormGroup, InputGroup} from '@blueprintjs/core'
import { DateInput, DatePicker, TimePrecision } from "@blueprintjs/datetime"
import {Button} from '@blueprintjs/core'
import {Component} from 'react'
import {StatefulComponent} from '@macrostrat/ui-components'
import ReactJSON from 'react-json-view'
import update from 'immutability-helper'

class Form extends Component
  #initializing a component
  constructor: (props) ->
    # when run the class, also run it for the class that it is extending
    super props
    # this.state is @state
    @state = {
      formData: {
        sample_text: null
      }
    }

  render: ->

  #  updater = (key) => (event) =>

    h 'div.shan-form', [
      h 'h1', '10Be Sample Data Input Form'
      h 'h2', 'General information of the sample'
      h ReactJSON, {src: @state.formData}

      h FormGroup, {
        helperText: 'Enter the sample name',
        label: 'Sample'
      }, [
        h InputGroup, {
          id: 'sample-text-input',
          placeholder: 'Sample text',
          value: @state.formData.sample_text,
          onChange: (event) =>
            newState = update @state, {formData:{sample_text:{$set: event.target.value}}}
            @setState(newState)
        }
      ]
      h FormGroup, {
        helperText: 'Enter the sample id',
        label: 'Sample ID'
      }, [
        h InputGroup, {
          id: 'sample-id-input',
          placeholder: 'Sample ID'
          value: @state.formData.sample_id,
          onChange: (event) =>
            newState = update @state, {formData:{sample_id:{$set: event.target.value}}}
            @setState(newState)
        }
      ]
      h 'h2','Sample location'
      h FormGroup, {
        helperText: '-90 to 90 degrees',
        label: 'Latitude'
      }, [
        h InputGroup, {id: 'lat-text-inout', placeholder: 'Lat value'}
      ]
      h FormGroup, {
        helperText: '-180 to 180 degrees',
        label: 'Longitude'
      }, [
        h InputGroup, {id: 'lon-text-inout', placeholder: 'Lon value'}
      ]
      h FormGroup, {
        helperText: 'General location. e.g. Northern Wisconsin',
        label: 'Location Name'
      }, [
        h InputGroup, {id: 'location-text-inout', placeholder: 'Location'}
      ]
      h FormGroup, {
        helperText: 'in meters',
        label: 'Elevation'
      }, [
        h InputGroup, {id: 'elevation-text-inout', placeholder: 'Elevation value'}
      ]
      h 'h2', 'Date of collecting'
      h DatePicker,{
        #defaultValue: {today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()},
        todayButtonText: 'today'
      }
      # h DateInput, {
      #   formatDate: {date => date.toLocaleString()}
      #   onChange: {this.handleDateChange}
      #   parseDate: {str => new Date(str)}
      # }
      h 'h2', 'Sample analysis'
      h FormGroup, {
        helperText: '0-1',
        label: 'Shielding'
      }, [
        h InputGroup, {id: 'shielding-text-inout', placeholder: 'Shielding value'}
      ]
      h FormGroup, {
        helperText: '0-100',
        label: 'Quartz'
      }, [
        h InputGroup, {id: 'quartz-text-inout', placeholder: 'Quartz value'}
      ]
      h FormGroup, {
        helperText: '0-500',
        label: '9Be Carrier'
      }, [
        h InputGroup, {id: '9be-text-inout', placeholder: 'Quartz value'}
      ]
      h FormGroup, {
        helperText: '1E-10 to 1E-20',
        label: '10Be/9Be'
      }, [
        h InputGroup, {id: 'be-ratio-text-inout', placeholder: '10Be/9Be value'}
      ]
      h FormGroup, {
        helperText: '1E-10 to 1E-20',
        label: '1 Sigma'
      }, [
        h InputGroup, {id: '1sig-text-inout', placeholder: '1-sigma value'}
      ]
      h FormGroup, {
        helperText: '0 to 1E-10, atoms/g',
        label: '10Be'
      }, [
        h InputGroup, {id: '10be-text-inout', placeholder: '10Be value'}
      ]
      h FormGroup, {
        helperText: '0 to 1E-10, atoms/g',
        label: 'Uncertainty'
      }, [
        h InputGroup, {id: 'uncertainty-text-inout', placeholder: 'Uncertainty value'}
      ]
      h FormGroup, {
        helperText: '0 - 700 ka',
        label: '10Be Age'
      }, [
        h InputGroup, {id: '10be-age-text-inout', placeholder: 'Age value'}
      ]
      h FormGroup, {
        helperText: 'Enter additional information',
        label: 'Notes'
      }, [
        h InputGroup, {id: 'notes-text-inout', placeholder: 'Notes or comments'}
      ]
      h Button, {
        active: 'False',
        text: 'Submit'
        #icon: 'document'
      }
    ]

export default Form
