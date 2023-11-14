import { LitElement, css, html } from 'lit'
import { clear } from '../utils/storage.js'
import { redirect } from '../utils/navigate.js'
import { customElement } from 'lit/decorators.js'

@customElement('logout-button')
export default class LogoutButton extends LitElement {
  static styles = css`
    button {
      cursor: pointer;
      display: block;
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  `

  logout = (): void => {
    clear()
    redirect('/')
  }

  render = () => html`<button @click=${this.logout}>Log Out</button>`
}
