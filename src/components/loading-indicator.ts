import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('loading-indicator')
export default class LoadingIndicator extends LitElement {
  static styles = css`
    .loading {
      align-items: center;
      background: var(--gradient);
      border-radius: 50%;
      color: white;
      display: flex;
      height: 10rem;
      justify-content: center;
      width: 10rem;
      transition: height 0.4s ease, width 0.1s ease;
    }

    .loading[data-tick='1'] {
      height: 11rem;
      width: 11rem;
    }

    .loading[data-tick='2'] {
      height: 12rem;
      width: 12rem;
    }

    .loading[data-tick='3'] {
      height: 13rem;
      width: 13rem;
    }

    .loading p {
      font-size: 2rem;
      margin: 0;
      text-shadow: 0.1rem 0.1rem var(--tempest);
    }
  `
  #intervalId: number | undefined

  @state()
  private tick: number = 0

  connectedCallback(): void {
    super.connectedCallback()
    this.#intervalId = setInterval(() => {
      this.tick = (this.tick + 1) % 4
      this.requestUpdate()
    }, 500)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    clearInterval(this.#intervalId)
  }

  render = () =>
    html`
      <div data-tick="${this.tick}" class="loading">
        <p>loading</p>
      </div>
    `
}
