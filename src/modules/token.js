import { TOKEN_KEY } from './consts.js'
import { read } from './storage.js'

const TOKEN_URL = 'https://swd.weatherflow.com/id/oauth2/token'

export const toToken = async ({
  clientId: client_id,
  codeVerifier: code_verifier,
  code,
}) =>
  (
    await fetch(TOKEN_URL, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id,
        code_verifier,
        code,
      }),
    })
  ).json()

export const hasValidToken = async () => {
  const token = read(TOKEN_KEY)
  if (!token) {
    return false
  }
  const status = (
    await fetch(
      `https://swd.weatherflow.com/swd/rest/stations?token=${token}`,
      { method: 'HEAD' },
    )
  ).status

  return status === 200
}
