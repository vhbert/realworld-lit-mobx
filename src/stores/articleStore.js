import {observable, action, toJS, remove} from "mobx";
import APIService from "../services/APIService";
import CommonStore from "./commonStore";
import {persist} from "mobx-persist";

let authStore, rootStore, commonStore;

class ArticleStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    authStore = rootStore.authStore;
    commonStore = rootStore.commonStore;
    authStore = rootStore.authStore;
  }

  @persist("list") @observable  articles = [];
  @observable activeArticle = {};
  @observable activeComments = [];
  @observable filterCondition = {all: 1};
  @observable tagList = [];
  @observable profileArticleLoaded = false;

  @action setFilter(filter) {
    this.filterCondition = filter;
  }

  @action setTags(tags) {
    this.tagList = tags;
  }

  @action
  async createArticle(article) {
    await APIService.Request.createArticle(article).then(r => {
      return Promise.resolve();
    }).catch(err => {
      authStore.authErrors = err.response.data.errors;
      return Promise.reject(err);
    });
  }

  @action
  async updateArticle(slug, article) {
    return new Promise(function (resolve, reject) {
      APIService.Request.updateArticle(slug, article).then(r => {
        resolve(r.data.article);
      }).catch(err => {
        authStore.authErrors = err.response.data.errors;
        reject(err);
      });
    });
  }

  @action
  async deleteArticle(slug) {
    await APIService.Request.deleteArticle(slug).then(r => {
      return Promise.resolve();
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  @action clearArticles() {
    this.articles = [];
    commonStore.isLoading = true;
  }

  @action
  async setFavorite(slug, current) {
    if (!authStore.activeUser) {
      return Promise.reject("noAuth");
    }
    let article = {};
    if (current) {
      article = this.activeArticle;
    } else {
      const articleIndex = toJS(this.articles.findIndex(e => e.slug === slug));
      article = this.articles[articleIndex];
    }

    if (article.favorited) {
      article.favorited = false;
      article.favoritesCount -= 1;
      await APIService.Request.unSetFavorite(slug).then(r => {
        return Promise.resolve();
      }).catch(err => {
        article.favorited = true;
        article.favoritesCount += 1;
        return Promise.reject(err);
      });
    } else {
      article.favorited = true;
      article.favoritesCount += 1;
      await APIService.Request.setFavorite(slug).then(r => {
        return Promise.resolve();
      }).catch(err => {
        article.favorited = false;
        article.favoritesCount -= 1;
        return Promise.reject(err);
      });
    }
  }

  @action getComments(slug) {
    APIService.Request.getComments(slug).then(r => {
      this.activeComments = r.data.comments;
    });
  }

  @action
  async addComment(slug, comment) {
    await APIService.Request.addComment(slug, comment).then(r => {
      return Promise.resolve(r);
    }).catch(err => {
    });
  }

  @action
  async deleteComment(slug, id) {
    await APIService.Request.deleteComment(slug, id).then(r => {
      this.activeComments.remove(this.activeComments[this.activeComments.map(e => e.id).findIndex(c => c === id)]);
      return Promise.resolve(r);
    }).catch(err => {
    });
  }


  @action getTagList() {
    APIService.Request.getTags().then(r => {
      this.setTags(r.data.tags);
    });
  }

  @action getArticle(slug, allowStored = false) {
    return new Promise((resolve, reject) => {
        commonStore.isLoading = true;
        if (allowStored) {
          const article = this.articles.find(a => a.slug === slug);
          if (article) {
            this.activeArticle = article;
            commonStore.isLoading = false;
            resolve()
          }
        }
        APIService.Request.getArticle(slug).then(r => {
          this.activeArticle = r.data.article;
          commonStore.isLoading = false;

          resolve()

        });
      }
    );

  }


  @action getArticles() {
    const filterCondition = toJS(this.filterCondition);
    commonStore.isLoading = true;

    if (filterCondition.tag) {
      APIService.Request.getArticlesByTag(filterCondition.tag).then(r => {
        commonStore.isLoading = false;
        this.articles = r.data.articles;
      });
    } else if (filterCondition.author) {
      APIService.Request.getArticlesByAuthor(filterCondition.author).then(r => {
        commonStore.isLoading = false;
        this.articles = r.data.articles;
      }).catch(err => {
      });
    } else if (filterCondition.favoritedBy) {
      APIService.Request.getArticlesByFavoritedUser(filterCondition.favoritedBy).then(r => {
        commonStore.isLoading = false;
        this.articles = r.data.articles;
      });
    } else if (filterCondition.feed) {
      APIService.Request.getArticlesFeed().then(r => {
        commonStore.isLoading = false;
        this.articles = r.data.articles;
      });
    } else {
      APIService.Request.getArticles().then(r => {
        commonStore.isLoading = false;
        this.articles = r.data.articles;

      });
    }
  }
}

export default ArticleStore;