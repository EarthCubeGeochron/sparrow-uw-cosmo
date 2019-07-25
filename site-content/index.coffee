import {Markdown, HTML} from '@macrostrat/ui-components'
import aboutText from './about-the-lab.md'
#import test from './test-base.html'
import h from 'react-hyperscript'
import {GLMap} from 'plugins/gl-map'

export default {
  landingText: h Markdown, {src: aboutText}
  siteTitle: 'Wisconsin Cosmo'
  adminBase: h HTML, {src: "<h2>Admin View Test</h2>"}
}
