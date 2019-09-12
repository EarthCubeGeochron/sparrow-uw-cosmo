import h from 'react-hyperscript'
import {FormGroup, InputGroup} from '@blueprintjs/core'

Form = ->
  h 'div.shan-form', [
    h 'h1', 'Form HI'
    h FormGroup, {
      helperText: 'help',
      label: 'A test'
    }, [
      h InputGroup, {id: 'text-input', placeholder: 'value'}
    ]
  ]

export default Form
