# maplibre-gl-layer

A layer control for [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/).

## Installation

```sh
npm install maplibre-gl-layer
```

## Usage

```js
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LayerControl } from "maplibre-gl-layer";

const map = new Map({
  /* YOUR_MAP_OPTIONS */
});

map.addControl(new LayerControl({
  layers: [
    {
      name: 'light',
      style: 'https://api.protomaps.com/styles/v4/white/ja.json',
    },
    {
      name: 'dark',
      style: 'https://api.protomaps.com/styles/v4/black/ja.json',
    }
  ]
}))
```

## License

This project is licensed under the terms of the [MIT license](./LICENSE).
