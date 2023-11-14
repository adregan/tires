import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { CLIENT_ID, TOKEN_KEY } from '../oauth/consts.js'
import { fetchToken } from '../oauth/fetchToken.js'
import { redirect } from '../utils/navigate.js'
import { toSave } from '../utils/storage.js'
import '../components/loading-indicator.js'
import '../components/error-dialog.js'

@customElement('auth-page')
class AuthPage extends LitElement {
  @state()
  private code: string = ''
  @state()
  private codeVerifier: string = ''

  saveToken = toSave(TOKEN_KEY)

  constructor() {
    super()
    const urlParams = new URLSearchParams(window.location.search)
    this.code = urlParams.get('code') ?? ''
    this.codeVerifier = urlParams.get('state') ?? ''

    this.shadowRoot
      ?.querySelector('error-dialog')
      ?.addEventListener('closed', e => console.log(e))
  }

  async connectedCallback() {
    super.connectedCallback()

    const token = await fetchToken({
      clientId: CLIENT_ID,
      codeVerifier: this.codeVerifier,
      code: this.code,
    })

    this.saveToken(token)
    redirect('/tires')
  }

  render = () =>
    !this.code || !this.codeVerifier
      ? html`
          <error-dialog @close=${() => redirect('/')}>
            Something went wrong connecting your account. Please try again.
          </error-dialog>
        `
      : html`<loading-indicator></loading-indicator>`
}
