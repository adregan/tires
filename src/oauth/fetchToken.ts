const TOKEN_URL = 'https://swd.weatherflow.com/id/oauth2/token'

type Options = {
  clientId: string
  codeVerifier: string
  code: string
}

export const fetchToken = async ({
  clientId: client_id,
  codeVerifier: code_verifier,
  code,
}: Options): Promise<string> => {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id,
      code_verifier,
      code,
    }),
  }).catch(e => {
    console.log(`Original error: ${e}`)
    throw Error('Needs Retry')
  })

  const {
    access_token: token,
    status: { status_code: statusCode },
  } = <ApiToken>await resp.json()

  if (statusCode !== 0) {
    throw Error('Something went wrong when trying to authorize')
  } else {
    return token
  }
}

type ApiToken = {
  access_token: string
  status: {
    status_code: number
  }
}
