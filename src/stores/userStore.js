import {observable, action} from "mobx";
import APIService from "../services/APIService";
import CommonStore from "./commonStore";

let authStore, rootStore;

class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    authStore = rootStore.authStore;
  }


  @action async getSelf() {
    await APIService.Request.getUserInfo().then(r => {
      authStore.setActiveUser(r.data.user);
      return Promise.resolve();
    }).catch(err => {
      this.authErrors = err.response.data.errors;
      return Promise.reject(err.response.status);
    });
  }




  @action
  async updateUser(user) {
    await APIService.Request.updateUser(user).then(r => {
      authStore.setActiveUser(r.data.user);
      return Promise.resolve();
    }).catch(err => {
      this.authErrors = err.response.data.errors;
      return Promise.reject(err.response.status);
    });
  }
}

export default UserStore;