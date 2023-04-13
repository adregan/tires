import { TOKEN_KEY } from '../oauth/consts.js'
import { read, clear } from '../utils/storage.js'
import { redirect } from '../utils/navigate.js'
import fetchStations from '../weather/fetchStations.js'
import fetchObservations from '../weather/fetchObservations.js'
import '../components/logout-button.js'
import '../components/station-info.js'

const main = async () => {
  const token = read(TOKEN_KEY) as string

  const stations = await fetchStations(token)

  const currentDevice = stations[0].devices.filter(
    ({ environment }) => environment === 'outdoor',
  )[0]

  const observations = await fetchObservations(token, currentDevice.id)
  type DailyTemps = Record<string, number[]>
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
  const drops = Object.entries(dailyTemps)
    .map(([date, temps]): [string, boolean] => [date, temps.some(x => x <= 0)])
    .filter(([, hadDrop]) => Boolean(hadDrop))
    .map(([date]: [string, boolean]): string => date)

  const recentDrop: string = new Date(drops.at(-1) ?? '').toLocaleDateString()

  const averageTemp =
    observations.reduce((acc, { temperature }) => acc + temperature, 0) /
    observations.length

  const cutoff = new Date(`March 1, ${new Date().getFullYear()}`)
  const now = observations.at(-1)?.date ?? new Date()

  writeTo('#startDate', observations[0].date.toLocaleDateString())
  writeTo('#pastDate', now > cutoff ? '✓' : '✗')
  writeTo('#avgTemp', `${Math.round(toF(averageTemp))}°F`)
  writeTo(
    '#drops',
    `${drops.length.toString()}${
      drops.length ? ` (most recently: ${recentDrop})` : ''
    }`,
  )
}

const verifyToken = (token: string | null): token is string => Boolean(token)

const logout = (): void => {
  clear()
  redirect('/')
}

const writeTo = (element: string, content: string): void =>
  document.querySelector(element)?.replaceChildren(content)

const toF = (C: number): number => C * 1.8 + 32

main()
