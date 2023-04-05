import { CLIENT_ID, TOKEN_KEY, VERIFIER_KEY } from '../oauth/consts.js'
import { toToken } from '../oauth/token.js'
import { redirect } from '../utils/navigate.js'
import { read, toSave } from '../utils/storage.js'

const code = new URLSearchParams(window.location.search).get('code') ?? ''

if (!code) {
  redirect('/')
}

const tokenResp = await toToken({
  clientId: CLIENT_ID,
  codeVerifier: read(VERIFIER_KEY) ?? '',
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
