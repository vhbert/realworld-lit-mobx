import {Base} from "./Base";
import {html} from "lit-html";
import {router} from "../router";

let _store;

class ArticlePreview extends Base {
  static properties = {
    article: {type: Object}
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  formattedDate(){
    return new Date(this.article.createdAt).toDateString();
  };

  handleFavorite = () => {
    if (!_store.authStore.activeUser) {
      router.transitionTo('login', {});
    } else {
      _store.articleStore.setFavorite(this.article.slug, false);
    }
  };

  render() {
    const article = this.article;

    return html`
      <div class="article-preview" routerlinks>
          <div class="article-meta">
              <a href="#profile/${article.author.username}">
                  <img src="${article.author.image}" alt=""/>
              </a>
              <div class="info">
                  <a route="profile" param-username="${article.author.username}" class="author">
                      ${article.author.username}
                  </a>
                  <span class="date">${this.formattedDate()}</span>
              </div>
              <button @click="${this.handleFavorite}" class="btn  btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}">
                  <i class="ion-heart"></i> ${article.favoritesCount}
              </button>
          </div>
          <a class="preview-link" route="article" param-slug="${article.slug}">
              <h1>${article.title}</h1>
              <p>${article.description}</p>
              <span>Read more...</span>
              <ul class="tag-list" routerlinks>
                  ${article.tagList.map(tag => {return html`
                  <li class="tag-default tag-pill tag-outline">
                      <a  route="home" query-type="tag" query-tag="${tag}" >${tag}</a>
                  </li>
                  `;})}
              </ul>
          </a>
      </div>`;
  }
}

customElements.define('article-preview', ArticlePreview);