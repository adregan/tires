const toVerifier = () =>
  self.crypto.getRandomValues(new Uint16Array(10)).join('')

export const genVerifier = async (storeFn) => {
  const codeVerifier = toVerifier()
  await storeFn(codeVerifier)
  return codeVerifier
}

export const toCodeChallenge = async (verifier) =>
  base64UrlEncode(await digestMessage(verifier))

const digestMessage = async (message) => {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return hashHex
}

const base64UrlEncode = (digest) =>
  btoa(digest)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
