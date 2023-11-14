import { LitElement, css, html } from 'lit'
import type { Device, Station } from '../weather/stations.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('station-info')
export class StationInfo extends LitElement {
  static styles = css`
    p {
      margin: 0;
    }
  `
  @property()
  stationName: Device['name'] = ''

  @property()
  deviceName: Station['name'] = ''

  render = () =>
    html`
      <article>
        <p>Station: ${this.stationName}</p>
        <p>Device: ${this.deviceName}</p>
      </article>
    `
}
