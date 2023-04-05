import { TOKEN_KEY, TOKEN_URL } from './consts.js'
import { read } from './storage.js'

type Options = {
  clientId: string
  codeVerifier: string
  code: string
}

export const toToken = async ({
  clientId: client_id,
  codeVerifier: code_verifier,
  code,
}: Options) =>
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
