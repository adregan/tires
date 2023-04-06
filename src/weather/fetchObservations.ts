import { Observation } from './observation.js'

const OBS_URL = 'https://swd.weatherflow.com/swd/rest/observations/device'

const THREE_WEEKS = 1_814_400 // A magic number that represents 3 weeks in seconds

const fetchObservations = async (
  token: string,
  deviceId: string,
): Promise<Observation[]> => {
  const now = Math.floor(Date.now() / 1000) // epoch time

  const params = new URLSearchParams({
    time_start: (now - THREE_WEEKS).toString(),
    time_end: now.toString(),
  }).toString()

  const resp = await fetch(`${OBS_URL}/${deviceId}?${params}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return (await resp.json()).obs.map(toObservation)
}

export default fetchObservations

type ApiObservation = number[]

const DATE_IDX = 0
const TEMP_IDX = 7

const toObservation = (obs: ApiObservation): Observation => ({
  date: new Date(obs[DATE_IDX] * 1000),
  temperature: obs[TEMP_IDX],
})
