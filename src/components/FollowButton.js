import {Base} from "./Base";
import {html} from "lit-html";
import {toJS} from "mobx";

let _store;

class FollowButton extends Base {

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  handleFollow = () => {
    _store.profileStore.followUser(_store.profileStore.activeProfile.username);
  };

  render() {
    let profile = _store.profileStore.activeProfile;
    return html`
      <button class="btn btn-sm action-btn ${profile.following === true ? 'btn-outline-secondary' : 'btn-secondary'}"
              @click="${this.handleFollow}">
        <i class="ion-plus-round"></i>&nbsp;
        ${profile.following === true ? html` Unfollow` : html` Follow`}
      </button>`;
  }
}

export default FollowButton;
customElements.define("follow-button", FollowButton);