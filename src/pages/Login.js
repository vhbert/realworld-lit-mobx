import {html} from "lit-html";
import {Base} from "../components/Base";
import {toJS} from "mobx";
import "../components/ErrorList";

import {paramValue, queryValue} from 'slick-router/middlewares/wc';

let _store, currentRoute;
let username = "";
let password = "";
let email = "";

class LoginView extends Base {
  static get properties() {
    return {};
  }

  isLogin = () => {
    return currentRoute.includes("login");
  };

  submitForm = ev => {
    ev.preventDefault();
    if (this.isLogin()) {
      _store.authStore.login(email, password).then(() => {
        this.$router.replaceWith("home");
      });
    } else {
      _store.authStore.register(username, email, password).then(() => this.$router.replaceWith("home")
      ).catch(err => {
        console.log(err);
      });
    }
  };
  handleEmailChange = (e) => {
    email = e.target.value;
  };
  handleUsernameChange = (e) => {
    username = e.target.value;
  };
  handlePasswordChange = (e) => {
    password = e.target.value;
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
    _store.authStore.clearErrors();
  }

  set $route(value) {
    currentRoute = value.pathname.replace("/", "");
  }

  render() {
    const authErrors = _store.authStore.authErrors;
    let formattedErrors = [];
    Object.keys(authErrors).map(key => {
      for (const i in authErrors[key]) {
        formattedErrors.push(`${key} ${authErrors[key][i]}`);
      }
    });
    return html` 
      <div class="auth-page">
        <div class="container page">
          <div class="row">      
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">${this.isLogin() ? html`Sign in` : html`Sign up`}</h1>
              <p class="text-xs-center" routerlinks>
              ${this.isLogin() ? html`
              <a route="register">Need an account?</a>
              ` : html`
              <a route="login">Have an account?</a>
              `}
              </p>
              <error-list .errors=${formattedErrors}></error-list>   
                <form>              
              ${!this.isLogin() ?
                html`
                <fieldset class="form-group">
                   <input @change=${this.handleUsernameChange} value="${username}" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>`
                : ""}                             
                <fieldset class="form-group">
                  <input @change=${this.handleEmailChange} value="${email}" class="form-control form-control-lg" type="email" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input @input=${this.handlePasswordChange} value="${password}" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" @click="${this.submitForm}">
                ${this.isLogin() ? html`Sign in` : html`Sign up`}
                </button>
              </form>
            </div>      
          </div>
        </div>
      </div>
    `;
  }
}

export default LoginView;
customElements.define('login-view', LoginView);