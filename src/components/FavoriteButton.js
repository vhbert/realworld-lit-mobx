import {Base} from "./Base";
import {html} from "lit-html";
import {router} from "../router";

let _store;

class FavoriteButton extends Base {
  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  handleFavorite = () => {
    if (!_store.authStore.activeUser) {
      router.transitionTo('login', {});
    }
    let article = _store.articleStore.activeArticle;
    _store.articleStore.setFavorite(article.slug, true);
  };

  render() {
    let article = _store.articleStore.activeArticle;
    return html`
    <button class="btn btn-sm  ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}" @click="${this.handleFavorite}">
      <i class="ion-heart"></i>  
      ${article.favorited ? 
        html` Unfavorite Post` :
        html` Favorite Post`}
      <span class="counter">(${article.favoritesCount})</span>
    </button>`;
  }
}

export default FavoriteButton;
customElements.define("favorite-button", FavoriteButton);