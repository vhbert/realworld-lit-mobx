import {Base} from "./Base";
import {html} from "lit-html";
import {toJS} from "mobx";
import RootStore from "../stores/rootStore";
import APIService from "../services/APIService";
import {withRouterLinks} from 'slick-router/middlewares/router-links';

let _store;
class NavHeader extends Base {
  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  isLoggedIn() {
    return !!_store.authStore.activeUser;
  };

  render() {
    let activeUser = _store.authStore.activeUser;

    return html`
     <nav class="navbar navbar-light">
      <div class="container" routerlinks>
        <a class="navbar-brand" route="home">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <a class=" nav-link "active-class="active" route="home">Home</a>
          </li>
      ${this.isLoggedIn() ?
      html`
          <li class="nav-item">
            <a class="nav-link" active-class="active" route="editor"   >
              <i class="ion-compose"></i>&nbsp;New Post
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" active-class="active" route="settings" >
              <i class="ion-gear-a"></i>&nbsp;Settings
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" active-class="active" route="profile" param-username="${activeUser.username}">
            ${activeUser.username}</a>
          </li>`
      : html` 
          <li class="nav-item">
            <a class="nav-link" active-class="active" route="login" ><i class="ion-compose"></i> Sign in</a>
          </li>
          <li class="nav-item">
           <a class="nav-link" active-class="active" route="register" ><i class="ion-compose"></i> Sign up</a>
          </li>`} 
        </ul>
      </div>
    </nav>
    `;
  }
}

customElements.define('app-header', NavHeader);
