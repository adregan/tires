import { CLIENT_ID, TOKEN_KEY } from '../oauth/consts.js'
import { toToken } from '../oauth/token.js'
import { redirect } from '../utils/navigate.js'
import { toSave } from '../utils/storage.js'

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code') ?? ''
const codeVerifier = urlParams.get('state') ?? ''

if (!code || !codeVerifier) {
  // TODO: Display an error to the user and try again from the auth
  redirect('/')
}

// This call can often 404 so need to retry and then display error to user
const tokenResp = await toToken({
  clientId: CLIENT_ID,
  codeVerifier,
  code,
})

const statusCode = tokenResp?.status?.status_code ?? -1

if (statusCode === 0) {
  const token = tokenResp['access_token']
  toSave(TOKEN_KEY)(token)
  redirect('/tires')
} else {
  redirect('/')
}
