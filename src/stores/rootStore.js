import AuthStore from './authStore';
import CommonStore from './commonStore';
import UserStore from "./userStore";
import ArticleStore from "./articleStore";

import {create} from "mobx-persist";
import ProfileStore from "./profileStore";

const hydrate = create({});


class RootStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.commonStore = new CommonStore();
    this.profileStore = new ProfileStore(this);
    this.userStore = new UserStore(this);
    this.articleStore = new ArticleStore(this);
    hydrate("auts", this.authStore);
    hydrate("arts", this.articleStore);
  }
}

export default RootStore;
