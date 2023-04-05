const iota = (n: number) => Array.from(Array(n), (_, i) => i)

export const genVerifier = (length: number, after: (v: string) => void) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const verifier = iota(length)
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join('')

  try {
    after(verifier)
  } catch (e) {
    console.error(`Created verifier but after action failed with: ${e}`)
  }

  return verifier
}

export const toCodeChallenge = async (message: string) => {
  const data = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode([...new Uint8Array(hash)])
}

const base64UrlEncode = (data: number[]) =>
  btoa(String.fromCharCode.apply(null, data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
