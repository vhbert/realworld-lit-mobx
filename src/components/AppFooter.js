import {Base} from "./Base";
import {html} from "lit-html";

class AppFooter extends Base {

  render() {
    return html`
    <footer>
      <div class="container" routerlinks>
        <a  route="home" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
    `;
  }
}

customElements.define("app-footer", AppFooter);