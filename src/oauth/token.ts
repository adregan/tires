import { TOKEN_URL } from './consts.js'

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

export const isValid = async (token: string) => {
  const status = (
    await fetch(
      `https://swd.weatherflow.com/swd/rest/stations?token=${token}`,
      { method: 'HEAD' },
    )
  ).status

  return status === 200
}
