import './LayerDialog.css'
import { ControlPosition } from 'maplibre-gl'
import type { LayerControlOptions, Layer } from '../maplibre-gl-layer'

export class LayerDialog {
  private dialog: HTMLDialogElement
  private options: LayerControlOptions
  private layerChangeCallback: (layer: Layer) => void = () => {}

  constructor(options: LayerControlOptions, defaultLayer: Layer) {
    this.options = options

    this.dialog = document.createElement('dialog')
    this.dialog.classList.add('maplibregl-ctrl-layer-dialog')
    document.body.appendChild(this.dialog)

    this.dialog.addEventListener('click', () => {
      this.dialog.close()
    })

    const content = document.createElement('div')
    content.classList.add('maplibregl-ctrl-layer-dialog-content')
    content.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    this.dialog.appendChild(content)

    this.options.layers.forEach((layer) => {
      const div = document.createElement('div')
      div.classList.add('maplibregl-ctrl-layer-dialog-item')
      // label
      const label = document.createElement('label')
      div.appendChild(label)

      // radio
      const radio = document.createElement('input')
      radio.setAttribute('type', 'radio')
      radio.setAttribute('name', 'layer')
      if (defaultLayer.name === layer.name) {
        radio.setAttribute('checked', 'checked')
      }
      radio.addEventListener('change', () => {
        this.layerChangeCallback?.(layer)
      })
      label.appendChild(radio)

      // span
      const span = document.createElement('span')
      span.textContent = layer.name
      label.appendChild(span)

      content.appendChild(div)
    })
  }

  open(button: HTMLButtonElement, position: ControlPosition | null = null) {
    this.dialog.showModal()
    this.setPosition(button, position)
  }

  close() {
    this.dialog.close()
  }

  on(type: string, callback: (layer: Layer) => void) {
    if (type === 'layerchange') {
      this.layerChangeCallback = callback
    }
  }

  private setPosition(
    button: HTMLButtonElement,
    position: ControlPosition | null,
  ) {
    const rect = button.getBoundingClientRect()
    let top = ''
    let left = ''
    if (position === 'top-right') {
      top = `${rect.y}px`
      left = `${rect.x - this.dialog.clientWidth - 12}px`
    } else if (position === 'top-left') {
      top = `${rect.y}px`
      left = `${rect.x + rect.width + 12}px`
    } else if (position === 'bottom-right') {
      top = `${rect.y - this.dialog.clientHeight + rect.height}px`
      left = `${rect.x - this.dialog.clientWidth - 12}px`
    } else if (position === 'bottom-left') {
      top = `${rect.y - this.dialog.clientHeight + rect.height}px`
      left = `${rect.x + rect.width + 12}px`
    }
    this.dialog.style.setProperty('top', top)
    this.dialog.style.setProperty('left', left)
  }
}
