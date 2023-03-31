import { genVerifier, toCodeChallenge } from './modules/codeVerifier.js'
import { toAuthUrl } from './modules/authorize.js'
import { CLIENT_ID, TOKEN_KEY, VERIFIER_KEY } from './modules/consts.js'
import { read, toSave } from './modules/storage.js'
import { redirect } from './modules/navigate.js'
import { hasValidToken } from './modules/token.js'
;(async () => {
  if (await hasValidToken()) {
    redirect('/tires')
  }

  const codeVerifier = genVerifier(60, toSave(VERIFIER_KEY))
  const codeChallenge = await toCodeChallenge(codeVerifier)
  const authUrl = toAuthUrl({ clientId: CLIENT_ID, codeChallenge })
  document.getElementById('authorize').setAttribute('href', authUrl)
})()
