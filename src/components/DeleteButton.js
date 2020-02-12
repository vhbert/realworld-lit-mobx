import {Base} from "./Base";
import {html} from "lit-html";
import {router} from "../router";

let _store;

class DeleteButton extends Base {

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  deleteArticle = () => {
    _store.articleStore.deleteArticle(_store.articleStore.activeArticle.slug).then(() => {
      router.transitionTo('home', {});
    });
  };

  render() {
    return html`
      <button class="btn btn-outline-danger btn-sm" @click="${this.deleteArticle}">
          <i class="ion-trash-a"></i> Delete Article
      </button>
      `;
  }
}

customElements.define('delete-button', DeleteButton);
