import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { TOKEN_KEY } from '../oauth/consts.js'
import { redirect } from '../utils/navigate.js'
import { read } from '../utils/storage.js'
import fetchStations from '../weather/fetchStations.js'
import '../components/loading-indicator.js'
import '../components/logout-button.js'
import '../components/weather-observations.js'
import '../components/station-info.js'
import { Device, Station } from '../weather/stations.js'

@customElement('tires-page')
export default class TiresPage extends LitElement {
  static styles = css`
    article {
      display: grid;
      grid-template-rows: max-content 1fr;
      justify-content: unset;
      height: 100vh;
    }

    header {
      align-items: center;
      color: white;
      background-image: var(--gradient);
      display: flex;
      justify-content: space-between;
      padding: 1rem;
    }

    .info {
      max-width: 75%;
    }

    main {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      width: 100%;
 j  }
  `
  @state()
  private token = read(TOKEN_KEY) ?? ''
  @state()
  private station: Station | undefined
  @state()
  private device: Device | undefined

  constructor() {
    super()
    if (!this.token) redirect('/')
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.fetchStationAndDevice()
  }

  async fetchStationAndDevice() {
    const [station] = await fetchStations(this.token)
    this.station = station
    this.device = station.devices.filter(
      ({ environment }) => environment === 'outdoor',
    )[0]
    this.requestUpdate()
  }

  render = () => html`
    <article>
      <header>
        ${when(
          Boolean(this.device),
          () => html`
            <station-info
              class="info"
              stationName=${this.station?.name}
              deviceName=${this.device?.name}
            ></station-info>
          `,
          () => html`
            <station-info
              class="info"
              stationName="loading..."
              deviceName="loading..."
            ></station-info>
          `,
        )}
        <logout-button></logout-button>
      </header>
      <main>
        <h1>should I change the&nbsp;tires?</h1>
        <weather-observations
          deviceid=${this.device?.id}
          token=${this.token}
        ></weather-observations>
      </main>
    </article>
  `
}
