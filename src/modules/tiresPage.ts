import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { until } from 'lit/directives/until.js'
import { when } from 'lit/directives/when.js'
import { TOKEN_KEY } from '../oauth/consts.js'
import { redirect } from '../utils/navigate.js'
import { read } from '../utils/storage.js'
import fetchStations from '../weather/fetchStations.js'
import '../components/loading-indicator.js'
import '../components/logout-button.js'
import '../components/weather-observations.js'
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
 j  }
  `
  @state()
  private token = read(TOKEN_KEY) ?? ''
  @state()
  private deviceId: string | undefined = ''

  constructor() {
    super()
    if (!this.token) redirect('/')
  }

  async fetchStationAndDevice() {
    const [station] = await fetchStations(this.token)
    const device = station.devices.filter(
      ({ environment }) => environment === 'outdoor',
    )[0]

    this.deviceId = device.id

    return html`
      <station-info
        class="info"
        stationName=${station.name}
        deviceName=${device.name}
      ></station-info>
    `
  }

  render = () => html`
    <article>
      <header>
        ${until(
    this.fetchStationAndDevice(),
    html`
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
        ${when(
    this.deviceId,
    () =>
      html`<weather-observations
              deviceId=${this.deviceId}
              token=${this.token}
            ></weather-observations>`,
    () => html`<loading-indicator></loading-indicator>`,
  )}
      </main>
    </article>
  `
}
