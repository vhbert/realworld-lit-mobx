import {Base} from "./Base";
import {html} from "lit-html";

class ErrorList extends Base {
  static properties = {
    errors: {}
  };

  render() {
    if (this.errors) {
      return html`
        <ul class="error-messages">
         ${this.errors.map(err => {return html`<li> ${err} </li>`;})}
        </ul>
      `;
    }
  }
}

customElements.define('error-list', ErrorList);
