const TOKEN_URL = 'https://swd.weatherflow.com/id/oauth2/token'

export const toToken = ({ clientId: client_id, codeVerifier: code_verifier, code }) =>
  fetch(
    TOKEN_URL,
    {
      method: 'POST',
      body: {
        grant_type: "authorization_code",
        client_id,
        code_verifier,
        code,
      }
    }
  )
