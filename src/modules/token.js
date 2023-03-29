const TOKEN_URL = 'https://swd.weatherflow.com/id/oauth2/token'

export const toToken = async ({ clientId: client_id, codeVerifier: code_verifier, code }) =>
  (await fetch(TOKEN_URL, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id,
        code_verifier,
        code,
      })
    }
  )).json()
