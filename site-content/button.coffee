import h from 'react-hyperscript'
#import {Button} from '@blueprintjs/core'
import { IntentSelect } from "./common/intentSelect"
#import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme"
#import { DateInput } from "@blueprintjs/datetime"

Button = ->
  h 'div.shan-button', [
    h 'h1', 'Submission'
    h Button, {
      active: 'False',
      text: 'Submit'
      #icon: 'document'
    }
  ]
export default Button
