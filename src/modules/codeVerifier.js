const iota = (n) => Array.from(Array(n), (_, i) => i)

export const genVerifier = (length, afterCreateFn) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const verifier = iota(length)
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join('')

  afterCreateFn(verifier)

  return verifier
}

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
