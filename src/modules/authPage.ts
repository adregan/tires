import { CLIENT_ID, TOKEN_KEY } from '../oauth/consts.js'
import { toToken } from '../oauth/token.js'
import { redirect } from '../utils/navigate.js'
import { toSave } from '../utils/storage.js'
import '../components/loading-indicator.js'
import '../components/error-dialog.js'
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('auth-page')
class AuthPage extends LitElement {
  @state()
  private code: string = ''
  @state()
  private codeVerifier: string = ''

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

    // TODO: This call can often 404 so need to retry and then display error to user
    const tokenResp = await toToken({
      clientId: CLIENT_ID,
      codeVerifier: this.codeVerifier,
      code: this.code,
    })

    const statusCode = tokenResp?.status?.status_code ?? -1

    if (statusCode === 0) {
      const token = tokenResp['access_token']
      toSave(TOKEN_KEY)(token)
      redirect('/tires')
    } else {
      redirect('/')
    }
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
