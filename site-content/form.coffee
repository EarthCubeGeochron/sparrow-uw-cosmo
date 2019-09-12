import h from 'react-hyperscript'
import {FormGroup, InputGroup} from '@blueprintjs/core'
import { DateInput } from "@blueprintjs/datetime"

Form = ->
  h 'div.shan-form', [
    h 'h1', 'Form HI'
    h FormGroup, {
      helperText: 'Enter the sample name',
      label: 'Sample'
    }, [
      h InputGroup, {id: 'sample-text-input', placeholder: 'Sample text'}
    ]
    h FormGroup, {
      helperText: '-90 to 90 degrees',
      label: 'Latitude'
    }, [
      h InputGroup, {id: 'lat-text-inout', placeholder: 'Lat value'}
    ]
    h FormGroup, {
      helperText: '-180 to 180 degrees',
      label: 'Latitude'
    }, [
      h InputGroup, {id: 'lon-text-inout', placeholder: 'Lon value'}
    ]
    # h FormGroup, {
    #   helperText: 'pick the date',
    #   label: 'Date'
    # }, [
    #   h DateInput, {
    #     formatDate: {date => date.toLocaleString()}
    #     onChange: {this.handleDateChange}
    #     parseDate: {str => new Date(str)}
    #     placeholder: {"MM/DD/YYYY"}
    #     value: {this.state.date}
    #   }
    # ]
    h FormGroup, {
      helperText: 'in meters',
      label: 'Elevation'
    }, [
      h InputGroup, {id: 'elevation-text-inout', placeholder: 'Elevation value'}
    ]
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
  ]

export default Form
