import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { Device, Station } from '../weather/stations.js'
import fetchStations from '../weather/fetchStations.js'
import { read } from '../utils/storage.js'
import { TOKEN_KEY } from '../oauth/consts.js'
import { redirect } from '../utils/navigate.js'
import '../components/logout-button.js'
import '../components/observations-table.js'
import '../components/station-info.js'

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
      height: 100%;
      justify-content: center;
      width: 100%;
    }
  `
  @state()
  private token = read(TOKEN_KEY) ?? ''
  @property({ type: Object })
  station: Station | undefined
  @property({ type: Object })
  device: Device | undefined

  constructor() {
    super()
    if (!this.token) redirect('/')
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.station || !this.device) {
      this.fetchStationAndDevice()
    }
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
          this.station && this.device,
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
        <observations-table></observations-table>
      </main>
    </article>
  `
}
