import { genVerifier, toCodeChallenge } from './modules/codeVerifier.js'
import { toAuthUrl } from './modules/authorize.js'

const CLIENT_ID = '2f36eae2-d93f-4a65-a258-b3bedca38321'

;(async () => {
  const verifier = await genVerifier(x => x)
  const codeChallenge = await toCodeChallenge(verifier)
  const authUrl = toAuthUrl({clientId: CLIENT_ID, codeChallenge})
  document.getElementById('authorize').setAttribute('href', authUrl)
})()
