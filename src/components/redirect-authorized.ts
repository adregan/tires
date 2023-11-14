import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TOKEN_KEY } from '../oauth/consts.js'
import { redirect } from '../utils/navigate.js'
import { read } from '../utils/storage.js'

@customElement('redirect-authorized')
export class RedirectAuthorized extends LitElement {
  @state()
  private showMessage: boolean = false

  connectedCallback() {
    super.connectedCallback()
    if (read(TOKEN_KEY)) {
      this.showMessage = true
      redirect('/tires')
    }
  }

  render = () =>
    this.showMessage ? html`<p>already authorized; logging in.</p>` : nothing
}
