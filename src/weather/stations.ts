export type Station = {
  id: string
  name: string
  publicName: string
  devices: Device[]
}

export type Device = {
  id: string
  type: string
  name: string
  environment: 'indoor' | 'outdoor'
}
