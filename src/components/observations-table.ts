import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import fetchObservations from '../weather/fetchObservations.js'
import { Device } from '../weather/stations.js'
import './loading-indicator.js'
import { until } from 'lit/directives/until.js'

@customElement('observations-table')
export default class ObservationsTable extends LitElement {
  @property()
  token: string = ''
  @property()
  deviceId: Device['id'] = ''

  getObservations = async () => {
    const observations = await fetchObservations(this.token, this.deviceId)
    return html`<div></div>`
  }

  render = () => html`
    ${until(
      this.getObservations(),
      html`<loading-indicator></loading-indicator>`,
    )}
  `
}
