import h from 'react-hyperscript'
import {FormGroup, InputGroup} from '@blueprintjs/core'

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
      label: '<sup>9</sup>Be'
    }, [
      h InputGroup, {id: '9be-text-inout', placeholder: 'Quartz value'}
    ]
  ]

export default Form
