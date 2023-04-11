import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('error-dialog')
export default class ErrorDialog extends LitElement {
  render = () => html`
    <dialog @close=${() => this.dispatchEvent(new Event('close'))} open>
      <p><slot></slot></p>
      <form method="dialog">
        <button value="default">ok</button>
      </form>
    </dialog>
  `
}
