const AUTH_URL = 'https://smartweather.weatherflow.com/authorize.html'

const toRedirectUrl = () =>
  `${window.location.protocol}//${window.location.host}/auth`

export const toAuthUrl = ({
  clientId: client_id,
  codeChallenge: code_challenge,
}) => {
  const params = {
    response_type: 'code',
    redirect_uri: toRedirectUrl(),
    code_challenge_method: 'S256',
    client_id,
    code_challenge,
  }
  const queryString = new URLSearchParams(params).toString()

  return `${AUTH_URL}?${queryString}`
}
