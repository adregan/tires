import { Station, Device } from './stations.js'

const STATIONS_URL = 'https://swd.weatherflow.com/swd/rest/stations'

const fetchStations = async (token: string): Promise<Station[]> => {
  const resp = await fetch(STATIONS_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return (await resp.json()).stations.map(toStation)
}

export default fetchStations

type ApiStation = {
  station_id: number
  name: string
  public_name: string
  devices: ApiDevice[]
}

const toStation = ({
  station_id,
  name,
  public_name: publicName,
  devices,
}: ApiStation): Station => ({
  id: station_id.toString(),
  name,
  publicName,
  devices: devices.map(toDevice),
})

type ApiDevice = {
  device_id: number
  device_type: string
  device_meta: {
    name: string
    environment: string
  }
}

const toDevice = ({
  device_id,
  device_type: type,
  device_meta: { name, environment },
}: ApiDevice): Device => ({
  id: device_id.toString(),
  type,
  name,
  environment: environment === 'outdoor' ? 'outdoor' : 'indoor',
})
