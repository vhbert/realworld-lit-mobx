import {Base} from "../components/Base";
import {html} from "lit-html";

let _store;

class ProfileView extends Base {

  static properties = {
    username: {type: String},
    pathname: {type: String}
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  set $route(value) {
    this.username = value.params.username;
    this.pathname = value.pathname;
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('username')) {
      this.getProfile();
    }
    if (changedProperties.has('pathname')) {
      this.setTag();
    }
    return true;
  }

  isLoggedIn() {
    return !!_store.authStore.activeUser;
  }

  isOwnProfile() {
    return _store.authStore.activeUser ? _store.authStore.activeUser.username === this.username : false;
  }

  getProfile() {
    _store.profileStore.getUserProfile(this.username);
  }

  setTag() {
    if (this.pathname.includes("/favorites")) {
      _store.articleStore.setFilter({favoritedBy: this.username});
    } else {
      _store.articleStore.setFilter({author: this.username});
    }
    _store.articleStore.getArticles();
  }

  render() {
    let profile = _store.profileStore.activeProfile;
    const articles = _store.articleStore.articles;
    return html`
      <div class="profile-page">
        <div class="user-info">
          <div class="container">
            <div class="row">      
              <div class="col-xs-12 col-md-10 offset-md-1">
                ${profile.image ? html`<img src="${profile.image}" class="user-img"  alt=""/>` : ''}
                <h4>${profile.username}</h4>
                <p>${profile.bio}</p>
                ${this.isLoggedIn() && !this.isOwnProfile() ? html`<follow-button></follow-button>` : ``}
              </div>      
            </div>
          </div>
        </div>     
        <router-slot></router-slot> 
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <div class="articles-toggle">
                <ul class="nav nav-pills outline-active" routerlinks>
                  <li class="nav-item">
                    <a class="nav-link" exact active-class="active" route="profile" param-username="${this.username}" >My Articles</a>
                  </li> 
                  <li class="nav-item">
                    <a class="nav-link" exact active-class="active" route="profile.favorites" param-username="${this.username}" >Favorited Articles</a>
                  </li>
                </ul>
              </div>              
              ${!_store.commonStore.isLoading ? html`
                ${articles.length !== 0 ? html`       
                  ${articles.map(art => html`<article-preview .article="${art}"></article-preview>`)}` : html`
                  <div class="article-preview">No articles are here... yet.</div>`}` : html`
                <loading-spinner></loading-spinner>
              `}
            </div>
          </div>
        </div>      
      </div>
    `;
  }
}

export default ProfileView;
customElements.define("profile-view", ProfileView);