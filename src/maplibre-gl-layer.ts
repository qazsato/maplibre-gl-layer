import './maplibre-gl-layer.css'
import type {
  Map,
  LayerSpecification,
  SourceSpecification,
  StyleSpecification,
  ControlPosition,
  IControl,
} from 'maplibre-gl'
import { LayerDialog } from './components/LayerDialog'

export type Layer = {
  name: string
  style: string | StyleSpecification
  checked?: boolean
}

export type LayerControlOptions = {
  layers: Layer[]
}

export class LayerControl implements IControl {
  private map: Map | null = null
  private options: LayerControlOptions
  private container: HTMLElement
  private currentLayer: Layer
  private currentInitStyle: StyleSpecification | null = null
  private addedSources: Record<string, SourceSpecification> = {}
  private addedLayers: LayerSpecification[] = []
  private layerDialog: LayerDialog

  constructor(options: LayerControlOptions) {
    this.options = options
    this.container = document.createElement('div')
    this.container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')
    this.currentLayer =
      options.layers.find((layer) => layer.checked) || options.layers[0]
    this.layerDialog = new LayerDialog(this.options, this.currentLayer)
    this.layerDialog.on('layerchange', (layer: Layer) => {
      this.changeLayer(layer)
      this.layerDialog.close()
    })
  }

  onAdd(map: Map) {
    this.map = map

    this.currentInitStyle = this.map.getStyle()
    if (!this.currentInitStyle) {
      this.map.once('style.load', () => {
        if (!this.map) return
        this.currentInitStyle = this.map.getStyle()
      })
    }

    const button = this.createButton()
    button.addEventListener('click', () => {
      this.layerDialog.open(button, this.getPosition())
    })
    this.container.appendChild(button)

    return this.container
  }

  onRemove() {
    this.container.parentNode?.removeChild(this.container)
  }

  private getPosition(): ControlPosition | null {
    if (!this.map) return null
    const p = this.map._controlPositions
    if (p['top-left'].querySelector('.maplibregl-ctrl-layer')) {
      return 'top-left'
    } else if (p['top-right'].querySelector('.maplibregl-ctrl-layer')) {
      return 'top-right'
    } else if (p['bottom-left'].querySelector('.maplibregl-ctrl-layer')) {
      return 'bottom-left'
    } else if (p['bottom-right'].querySelector('.maplibregl-ctrl-layer')) {
      return 'bottom-right'
    }
    return null
  }

  private createButton() {
    // Button
    const button = document.createElement('button')
    button.classList.add('maplibregl-ctrl-layer')
    button.setAttribute('title', 'Change map style')
    button.setAttribute('aria-label', 'Change map style')
    // Icon
    const i = document.createElement('i')
    i.classList.add('maplibregl-ctrl-icon')
    button.appendChild(i)
    return button
  }

  private changeLayer(layer: Layer) {
    if (!this.map) return
    // layer
    const beforeLayers = this.currentInitStyle!.layers
    const afterLayers = this.map.getStyle().layers
    const addedLayers = afterLayers.filter(
      (al) => !beforeLayers.some((bl) => bl.id === al.id),
    )
    this.addedLayers = [...this.addedLayers, ...addedLayers]
    const removedLayers = beforeLayers.filter(
      (bl) => !afterLayers.some((al) => al.id === bl.id),
    )
    this.addedLayers = this.addedLayers.filter(
      (layer) => !removedLayers.some((rl) => rl.id === layer.id),
    )

    // source
    const beforeSources = this.currentInitStyle!.sources
    const afterSources = this.map.getStyle().sources
    const addedSources: Record<string, SourceSpecification> = {}
    Object.entries(afterSources).forEach(([key, value]) => {
      if (!Object.keys(beforeSources).includes(key)) {
        addedSources[key] = value
      }
    })
    this.addedSources = { ...this.addedSources, ...addedSources }
    const removedSources = Object.keys(beforeSources).filter(
      (key) => !Object.keys(afterSources).includes(key),
    )
    removedSources.forEach((key) => {
      delete this.addedSources[key]
    })

    // ref: https://github.com/maplibre/maplibre-gl-js/issues/2587#issuecomment-1997263712
    this.map.setStyle(layer.style, {
      transformStyle: (_, nextStyle) => {
        const style = {
          ...nextStyle,
          sources: { ...nextStyle.sources, ...this.addedSources },
          layers: nextStyle.layers.concat(this.addedLayers),
        }
        this.currentInitStyle = style
        return style
      },
    })
  }
}
