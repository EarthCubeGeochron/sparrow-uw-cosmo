import {Markdown, HTML} from '@macrostrat/ui-components'
import aboutText from './about-the-lab.md'
import h from 'react-hyperscript'
#import Carto from './mapping'
import Form from './form'
import Popup2 from './Popup2'
import 'leaflet/dist/leaflet.css'

#console.log(test)

#=============React-leaflet does not work. If removed, the rest works.============
# testmap.js: Leaflet code
# test-base.js: render the React-leaflet to the <div id="map"></div> in the test-base.html

###
Steps to fix:
1. create a package.json that allows Webpack to resolve this directory as a "module" -
   that way, you can add your own dependencies such as webpack
2. Stay within the react system! That is, load the map as a react object
   _alongside_ your html rather than within it...
###


AdminBaseComponent = ->
  h 'div', [
    #h Carto
    h Form
  ]

export default {
  landingText: h Markdown, {src: aboutText}
  siteTitle: 'Wisconsin Cosmo'
  adminBase: h AdminBaseComponent
}
