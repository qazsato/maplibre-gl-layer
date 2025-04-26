import './style.css'
import { Map, addProtocol, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'
import { LayerControl } from './maplibre-gl-layer'

const map = new Map({
  container: 'map',
  style:
    'https://api.protomaps.com/styles/v4/white/en.json?key=afde32549db516d8',
  center: [139.7538, 35.6674],
  zoom: 11,
})
const protocol = new Protocol()
addProtocol('pmtiles', protocol.tile)

map.addControl(new NavigationControl())
map.addControl(
  new LayerControl({
    layers: [
      {
        name: 'light',
        style:
          'https://api.protomaps.com/styles/v4/white/ja.json?key=c936ad6c71886382',
      },
      {
        name: 'dark',
        style:
          'https://api.protomaps.com/styles/v4/black/ja.json?key=c936ad6c71886382',
      },
    ],
  }),
)
