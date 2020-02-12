import {html} from "lit-html";
import {Base} from "../components/Base";
import "../components/Tags";
import {toJS} from "mobx";
import {property} from "lit-element";

let _store;

class HomeView extends Base {

  static get properties() {
    return {
      type: {type: String},
      tag: {type: String}
    };
  }

  set $route(value) {
    this.type = value.query.type || 'all';
    this.tag = value.query.tag;
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('type') || changedProperties.has('tag')) {
      this.setTag();
      _store.articleStore.getArticles();
    }
    return true;
  }

  setTag() {
    switch (this.type) {
      case "tag":
        _store.articleStore.setFilter({tag: this.tag});
        break;
      case "feed":
        _store.articleStore.setFilter({feed: {}});
        break;
      default:
        _store.articleStore.setFilter({all: {}});
        break;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
    _store.articleStore.getTagList();
  }

  render() {
    let isLoading = _store.commonStore.isLoading;
    let articles = _store.articleStore.articles;
    let tags = _store.articleStore.tagList;

    return html`
     <div class="home-page">
        <div class="banner">
          <div class="container">
            <h1 class="logo-font" >conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>    
        <div class="container page">
          <div class="row">    
            <div class="col-md-9">
              <div class="feed-toggle">
                <ul class="nav nav-pills outline-active" routerlinks>
                  ${_store.authStore.activeUser ? html`
                  <li class="nav-item">
                    <a class="nav-link"
                       route="home"
                       query-type="feed" exact>Your Feed
                    </a>
                  </li>` : ``}        
                  <li class="nav-item">
                    <a class="nav-link ${this.type === 'all' ? 'active' : ''}"
                       route="home"
                       active-class="" exact>Global Feed
                    </a>
                  </li>
                  ${this.tag ? html`
                  <li class="nav-item">
                    <a class="nav-link" 
                       route="home"
                       query-type="tag" query-tag="${this.tag}" exact>
                        <i class="ion-pound"></i> ${this.tag}
                    </a>
                  </li>` : ''}     
                </ul>
              </div>
              ${isLoading ? html`<loading-spinner></loading-spinner>` : html`
              ${articles.map(art => html`<article-preview  .article="${art}"></article-preview>`)}`}    
            </div>          
              <div class="col-md-3">
                <div class="sidebar">
                  <p>Popular Tags</p>
                  <tag-items .tags="${tags}" ></tag-items>
                </div>
              </div>        
          </div>
        </div>    
     </div>
    `;
  }
}

export default HomeView;
customElements.define('home-view', HomeView);