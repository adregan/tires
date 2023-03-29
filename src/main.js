import { genVerifier, toCodeChallenge } from './modules/codeVerifier.js'
import { toAuthUrl } from './modules/authorize.js'
import { toToken } from './modules/token.js';

const CLIENT_ID = '2f36eae2-d93f-4a65-a258-b3bedca38321'

;(async () => {
  const codeVerifier = await genVerifier(x => x)
  const codeChallenge = await toCodeChallenge(codeVerifier)
  const authUrl = toAuthUrl({clientId: CLIENT_ID, codeChallenge})
  document.getElementById('authorize').setAttribute('href', authUrl)
  const code = new URLSearchParams(window.location.search).get('code') ?? ''
  if (code) {
    const token = await toToken({ clientId: CLIENT_ID, codeVerifier, code })
    console.log(token)
  } else {
    console.log('nope', code)
  }
})()
