export const genVerifier = () =>
  self.crypto.getRandomValues(new Uint16Array(10)).join('')

export const toCodeChallenge = async (message) => {
  const data = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(hash))
}

const base64UrlEncode = (data) =>
  btoa(String.fromCharCode.apply(null, data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
