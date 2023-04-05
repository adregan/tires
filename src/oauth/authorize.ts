import { AUTH_URL } from "./consts.js"

const toRedirectUrl = () =>
  `${window.location.protocol}//${window.location.host}/auth`

type Options = {
  clientId: string
  codeChallenge: string
}

export const toAuthUrl = ({
  clientId: client_id,
  codeChallenge: code_challenge,
}: Options) => {
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
