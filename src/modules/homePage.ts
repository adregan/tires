import { toAuthUrl } from '../oauth/authorize.js'
import { genVerifier, toCodeChallenge } from '../oauth/codeVerifier.js'
import { CLIENT_ID, TOKEN_KEY, VERIFIER_KEY } from '../oauth/consts.js'
import { redirect } from '../utils/navigate.js'
import { read, toSave } from '../utils/storage.js'

const token = read(TOKEN_KEY)
if (token) {
  redirect('/tires')
}

const codeVerifier = genVerifier(60, toSave(VERIFIER_KEY))
const codeChallenge = await toCodeChallenge(codeVerifier)
const authUrl = toAuthUrl({ clientId: CLIENT_ID, codeChallenge })
document.getElementById('authorize')?.setAttribute('href', authUrl)
