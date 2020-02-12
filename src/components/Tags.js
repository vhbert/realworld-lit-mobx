import {Base} from "./Base";
import {html} from "lit-html";

class Tags extends Base {

  static get properties() {
    return {
      tags: {type: Object}
    };
  }

  render() {
    return html`
    <div class="tag-list" routerlinks>
      ${this.tags.map(tag => html`
       <a  class="tag-pill tag-default" route="home" query-type="tag" query-tag="${tag}" >${tag}</a>
      `)}          
    </div>
    `;
  }
}

customElements.define("tag-items", Tags);