import { TOKEN_KEY } from '../oauth/consts.js'
import { read, clear } from '../utils/storage.js'
import { redirect } from '../utils/navigate.js'
import fetchStations from '../weather/fetchStations.js'

const main = async () => {
  const token = read(TOKEN_KEY)
  if (!verifyToken(token)) return logout()

  document.getElementById('logOut')?.addEventListener('click', () => logout)

  const stations = await fetchStations(token)

  const currentStation = stations[0]
  const currentDevice = currentStation.devices.filter(
    ({ environment }) => environment === 'outdoor',
  )[0]

  writeTo('#stationName', currentStation.name)
  writeTo('#deviceName', currentDevice.name)
}

const verifyToken = (token: string | null): token is string => Boolean(token)

const logout = (): void => {
  clear()
  redirect('/')
}

const writeTo = (element: string, content: string): void =>
  document.querySelector(element)?.replaceChildren(content)

main()
