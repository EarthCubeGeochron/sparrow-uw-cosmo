import {Markdown, HTML} from '@macrostrat/ui-components'
import aboutText from './about-the-lab.md'
import test from './test-base.html'
import h from 'react-hyperscript'
import {GLMap} from 'plugins/gl-map'
#console.log(test)

#=============React-leaflet does not work. If removed, the rest works.============
# testmap.js: Leaflet code
# test-base.js: render the React-leaflet to the <div id="map"></div> in the test-base.html


export default {
  landingText: h Markdown, {src: aboutText}
  siteTitle: 'Wisconsin Cosmo'
  adminBase: h HTML, {src: test}
}
