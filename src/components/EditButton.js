import {Base} from "./Base";
import {html} from "lit-html";
import {router} from "../router";

let _store;

class EditButton extends Base {

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  editArticle = () => {
    router.transitionTo('editor', {slug: _store.articleStore.activeArticle.slug});
  };

  render() {
    return html`
      <a class="btn btn-sm btn-outline-secondary" @click="${this.editArticle}">
        <i class="ion-edit"></i> Edit Article
      </a>
    `;
  }
}

customElements.define('edit-button', EditButton);
