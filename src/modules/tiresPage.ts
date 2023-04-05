import { TOKEN_KEY } from '../oauth/consts.js'
import { isValid } from '../oauth/token.js'
import { read, clear } from '../utils/storage.js'
import { redirect } from '../utils/navigate.js'

const token = read(TOKEN_KEY) ?? ''

if (!(await isValid(token))) {
  redirect('/')
}

document.getElementById('token')?.replaceChildren(token)

document.getElementById('logOut')?.addEventListener('click', () => {
  clear()
  redirect('/')
})
