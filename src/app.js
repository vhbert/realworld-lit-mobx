import {Base} from "./components/Base";
import {html} from "lit-html";
import service from "./services/APIService";

class App extends Base {
  static properties = {
    stores: {type: Object, attribute: false}
  };

  static providedContexts = {
    stores: {property: 'stores'}
  };

  firstUpdated() {
    // service.Init(this.stores);
    this.stores.authStore.getToken();
    if (this.stores.authStore.token) {
      this.stores.userStore.getSelf().then(() => {
      });
    }
  }

  render() {
    return html`
      <style>
        * { box-sizing: border-box; }
      </style>
      <div>
        <app-header></app-header>
        <router-slot></router-slot>
        <app-footer></app-footer>
      </div>
    `;
  }
}

customElements.define('realworld-app', App);
