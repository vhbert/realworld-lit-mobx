import {observable, action, computed} from "mobx";
import axios from "axios";
import APIService from "../services/APIService";
import {persist} from "mobx-persist";


class CommonStore {
  constructor(rootStore) {
  }

  @observable currentRoute = "";
  @observable isLoading = true;



  @action setRoute(newRoute){

    this.currentRoute =newRoute
  }

}

export default CommonStore;