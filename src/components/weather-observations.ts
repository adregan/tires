import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './loading-indicator.js'
import { until } from 'lit/directives/until.js'
import fetchObservations from '../weather/fetchObservations.js'
import type { Observation } from '../weather/observation.js'
import { when } from 'lit/directives/when.js'

type DailyTemps = Record<string, number[]>

@customElement('weather-observations')
export default class WeatherObservations extends LitElement {
  static styles = css`
    table {
      background: white;
      color: black;
      justify-self: center;
      margin: 0 1rem;
      padding: 1rem;
      max-width: max-content;
    }

    table caption {
      color: white;
      font-weight: 600;
      background: var(--tempest);
      padding: 1rem 0;
    }

    table td {
      padding: 1rem;
    }

    table tr {
      border-top: 1px solid black;
    }

    table td {
      text-align: right;
    }

    table td + td {
      text-align: left;
    }
  `
  @property({ type: String })
  deviceId: string = ''
  @property({ type: String })
  token: string = ''

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value)
    if (name === 'deviceid' && typeof value === 'string') {
      this.deviceId = value
      this.requestUpdate()
    }
  }

  getObservations = async () => {
    const { start, cutoff, averageTemp, drops } = await fetchObservations(
      this.token,
      this.deviceId,
    ).then(this.parseObservations)

    const now = new Date()
    const recentDrop = drops.length
      ? ` (most recently: ${drops.at(-1)?.toLocaleDateString()})`
      : undefined

    return html`
      <table>
        <caption>
          Observations since
          <span>${start.toLocaleDateString()}</span>
        </caption>
        <tr>
          <td>After March 1st</td>
          <td>${now > cutoff ? '✓' : '✗'}</td>
        </tr>
        <tr>
          <td>Average temperature</td>
          <td>${Math.round(toF(averageTemp))}°F</td>
        </tr>
        <tr>
          <td># of days with a temperature below freezing</td>
          <td>${drops.length}${recentDrop ?? ''}</td>
        </tr>
      </table>
    `
  }

  parseObservations(observations: Observation[]): {
    start: Date
    cutoff: Date
    averageTemp: number
    drops: Date[]
  } {
    const dailyTemps: DailyTemps = observations.reduce(
      (acc, { date, temperature }) => {
        const key = `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`
        const temps = acc[key] ?? []
        return {
          ...acc,
          [key]: [...temps, temperature],
        }
      },
      {} as DailyTemps,
    )

    return {
      start: observations[0].date,
      cutoff: new Date(`March 1, ${new Date().getFullYear()}`),
      averageTemp:
        observations.reduce((acc, { temperature }) => acc + temperature, 0) /
        observations.length,
      drops: Object.entries(dailyTemps)
        .map(([date, temps]): [string, boolean] => [
          date,
          temps.some(x => x <= 0),
        ])
        .filter(([, hadDrop]) => Boolean(hadDrop))
        .map(([date]) => new Date(date)),
    }
  }

  render = () =>
    when(
      this.deviceId,
      () => {
        return html`
          ${until(
            this.getObservations(),
            html`<loading-indicator></loading-indicator>`,
          )}
        `
      },
      () => html`<loading-indicator></loading-indicator>`,
    )
}

const toF = (C: number): number => C * 1.8 + 32
