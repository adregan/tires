import { TOKEN_KEY } from '../modules/consts.js'
import { redirect } from '../modules/navigate.js'
import { read } from '../modules/storage.js'
import { hasValidToken } from '../modules/token.js'
;(async () => {
  if (!(await hasValidToken())) {
    redirect('/')
  }
  const token = read(TOKEN_KEY)
  document.getElementById('token').textContent = token
})()
