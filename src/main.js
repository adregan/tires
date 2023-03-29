// import { genVerifier, toCodeChallenge } from './modules/codeVerifier.js'
import { toAuthUrl } from './modules/authorize.js'

const CLIENT_ID = '2f36eae2-d93f-4a65-a258-b3bedca38321'

;(async () => {
  // const verifier = await genVerifier(x => x)
  const verifier = 'm7ANSl5uFSwVYAIdE2NL-wqRZ8Y_Ou5X-d_tvQx8xGTtzG5O'
  // const codeChallenge = await toCodeChallenge(verifier)
  const codeChallenge = 'jUqhDBH-WT401__MnpDMFaCMMkkVTZFdmZesfUfWnZY'
  const authUrl = toAuthUrl({clientId: CLIENT_ID, codeChallenge})
  document.getElementById('authorize').setAttribute('href', authUrl)
})()
