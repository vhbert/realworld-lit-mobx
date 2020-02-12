import {action, observable, toJS} from "mobx";
import APIService from "../services/APIService";

class ProfileStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable activeProfile = {};
  @action setActiveProfile = (profile) => {
    this.activeProfile = profile;
  };


  @action
  async getUserProfile(username) {
    await APIService.Request.getUserInfo(username).then(r => {
      this.activeProfile = r.data.profile;
      return Promise.resolve();
    }).catch(err => {
      this.authErrors = err.response.data.errors;
      return Promise.reject(err.response.status);
    });
  }

  @action
  async followUser(username) {
    if (this.activeProfile.following === true) {
      await APIService.Request.unSetFollow(username).then(r => {
        this.activeProfile = r.data.profile;
      }).catch(err => console.log(err));
    } else {
      await APIService.Request.setFollow(username).then(r => {
        this.activeProfile = r.data.profile;
      });
    }
  }
}

export default ProfileStore;
