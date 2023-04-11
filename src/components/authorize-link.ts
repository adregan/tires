import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { until } from 'lit/directives/until.js'
import { toAuthUrl } from '../oauth/authorize.js'
import { genVerifier, toCodeChallenge } from '../oauth/codeVerifier.js'
import { CLIENT_ID } from '../oauth/consts.js'

@customElement('authorize-link')
export default class AuthorizeLink extends LitElement {
  static styles = css`
    a {
      color: white;
      display: block;
      background-image: var(--gradient);
      background-size: 200% 200%;
      font-weight: 500;
      padding: 1rem 2rem;
      text-decoration: none;
      animation: animate 10s ease infinite;
    }

    @keyframes animate {
      0% {
        background-position: 0% 50%;
      }

      50% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0% 50%;
      }
    }
  `

  async toHref() {
    const codeVerifier = genVerifier(60)
    const codeChallenge = await toCodeChallenge(codeVerifier)
    return toAuthUrl({
      clientId: CLIENT_ID,
      codeChallenge,
      state: codeVerifier,
    })
  }

  render = () =>
    html`
      <a class="authorize" href="${until(this.toHref(), '#')}">
        <slot></slot>
      </a>
    `
}
