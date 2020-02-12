import {Base} from "../components/Base";
import {html} from "lit-html";

let _store;

class SettingsView extends Base {

  constructor() {
    super();
    this.profile = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: null
    };
  }

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
    const {image, username, bio, email} = _store.authStore.activeUser;
    Object.assign(this.profile, {image, username, bio, email});
  }

  signOut = () => {
    _store.authStore.signOut();
    this.$router.replaceWith('home');
  };

  updateEntry = (entry) => (ev) => {
    this.profile[entry] = ev.target.value;
  };

  submitForm = (ev) => {
    ev.preventDefault();
    _store.userStore.updateUser(this.profile).then(() => this.$router.replaceWith('home'));
  };

  render() {

    return html`
      <div class="settings-page">
        <div class="container page">
          <div class="row">   
            <div class="col-md-6 offset-md-3 col-xs-12">
              <h1 class="text-xs-center">Your Settings</h1>      
              <form>
                <fieldset>
                    <fieldset class="form-group">
                      <input class="form-control" type="text" placeholder="URL of profile picture"
                       @change=${this.updateEntry('image')}
                       .value=${this.profile.image}>
                    </fieldset>
                    <fieldset class="form-group">
                      <input class="form-control form-control-lg" type="text" placeholder="Your Name" 
                      @change=${this.updateEntry('username')}
                      .value=${this.profile.username}>
                    </fieldset>
                    <fieldset class="form-group">
                      <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"
                       @change=${this.updateEntry('bio')}
                       .value=${this.profile.bio}></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                      <input class="form-control form-control-lg" type="text" placeholder="Email"
                       @change=${this.updateEntry('email')}
                       .value=${this.profile.email}>
                    </fieldset>
                    <fieldset class="form-group">
                      <input class="form-control form-control-lg" type="password" placeholder="Password"
                       @change=${this.updateEntry('password')}
                       .value=${this.profile.password}>
                    </fieldset>
                    <button class="btn btn-lg btn-primary pull-xs-right" @click="${this.submitForm}">
                      Update Settings
                    </button>
                </fieldset>
              </form>
              <hr>
              <button @click="${this.signOut}" class="btn btn-outline-danger">Or click here to logout.</button>
            </div>      
          </div>
        </div>
      </div>`;
  }
}

export default SettingsView;

customElements.define("settings-view", SettingsView);