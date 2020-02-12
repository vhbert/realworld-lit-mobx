import {observable, action, computed} from "mobx";
import APIService from "../services/APIService";
import {persist} from "mobx-persist";


class AuthStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @persist @observable token = null;
  @persist('object') @observable activeUser;

  @observable isLoading = false;
  @observable authErrors = {};

  @action setToken(token) {
    this.token = token;
    window.localStorage.setItem("token", token);
  }

  @action clearToken() {
    this.token = null;
    window.localStorage.removeItem('token');
  }

  @action setActiveUser(user) {
    this.activeUser = user;
  }

  @action clearErrors() {
    this.authErrors = {};
  }

  @action getToken() {
    this.token = window.localStorage.getItem("token");
  }

  @action signOut() {
    this.setActiveUser(null);
    this.clearToken();
  }

  @action
  async login(email, password) {
    this.isLoading = true;
    await APIService.Request.login(email, password).then(r => {
      this.setActiveUser(r.data.user);
      this.setToken(this.activeUser.token);
      return Promise.resolve();
    }).catch(err => {
      this.authErrors = err.response.data.errors;
      return Promise.reject(err.response.status);
    });
  }

  @action
  async register(username, email, password) {
    this.isLoading = true;
    await APIService.Request.register(username, email, password).then(r => {
      this.setActiveUser(r.data.user);
      this.setToken(this.activeUser.token);
      return Promise.resolve();
    }).catch(err => {
      this.authErrors = err.response.data.errors;
      return Promise.reject(err.response.status);
    }).finally(
      action(() => {
        this.isLoading = false;
      })
    );
  }




}

export default AuthStore;