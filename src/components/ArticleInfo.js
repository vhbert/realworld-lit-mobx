import {html} from "lit-html";
import {Base} from "./Base";

let _store;

class ArticleInfo extends Base {

  static properties = {
    article: {type: Object},
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  isOwnArticle(){
    return _store.authStore.activeUser ? _store.authStore.activeUser.username === this.article.author.username : false;
  };

  isLoggedIn(){
    return !!_store.authStore.activeUser;
  };

  render() {
    const article = this.article;

    return html`
        <div class="article-meta" routerlinks>
            <a route="profile" param-username="${article.author.username}">
                <img src="${article.author.image}" alt=""/>
            </a>
            <div class="info">
                <a route="profile" param-username="${article.author.username}" class="author">${article.author.username}</a>
                <span class="date">${new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            ${this.isOwnArticle()  ? html`              
                <delete-button></delete-button>
                <edit-button></edit-button>` :
              this.isLoggedIn() ? html`
                <follow-button></follow-button>
                <favorite-button></favorite-button>
              `:``}
        </div>`;
  }
}

customElements.define("article-info", ArticleInfo);