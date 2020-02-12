import axios from "axios";

const baseUrl = "https://conduit.productionready.io/api";

const getJWTToken = () => {
  return window.localStorage.getItem('token');
};

const setHeader = (isRequired) => {
  if (getJWTToken() && isRequired) {
    axios.defaults.headers.common['Authorization'] = "Token " + getJWTToken();
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const Request = {
  login: (email, password) => {
    setHeader(false);
    return axios.post(`${baseUrl}/users/login`, {user: {email, password}});
  },

  register: (username, email, password) => {
    setHeader(false);
    return axios.post(`${baseUrl}/users`, {user: {username, email, password}});
  },

  getUserInfo: (username) => {
    setHeader(true);
    if (username) {
      return axios.get(`${baseUrl}/profiles/${username}`);
    }
    return axios.get(`${baseUrl}/user`);
  },

  updateUser: (user) => {
    setHeader(true);
    return axios.put(`${baseUrl}/user`, user);
  },

  createArticle: (article) => {
    setHeader(true);
    return axios.post(`${baseUrl}/articles`, {article: article});
  },

  deleteArticle: (slug) => {
    setHeader(true);
    return axios.delete(`${baseUrl}/articles/${slug}`);
  },

  updateArticle: (slug, article) => {
    setHeader(true);
    return axios.put(`${baseUrl}/articles/${slug}`, article);
  },

  getArticle: (slug) => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles/${slug}`);
  },

  getArticles: () => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles`);
  },

  getArticlesFeed: () => {
    setHeader(true);
    return axios.get(`${baseUrl}/articles/feed`);
  },

  getArticlesByTag: (tag) => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles?tag=${tag}`);
  },

  getArticlesByAuthor: (author) => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles?author=${author}`);
  },

  getArticlesByFavoritedUser: (author) => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles?favorited=${author}`);
  },

  getTags: () => {
    setHeader(false);
    return axios.get(`${baseUrl}/tags`);
  },

  getComments: (slug) => {
    getJWTToken() !== undefined ? setHeader(true) : setHeader(false);
    return axios.get(`${baseUrl}/articles/${slug}/comments`);
  },

  addComment: (slug, comment) => {
    setHeader(true);
    return axios.post(`${baseUrl}/articles/${slug}/comments`, comment);
  },

  deleteComment: (slug, id) => {
    setHeader(true);
    return axios.delete(`${baseUrl}/articles/${slug}/comments/${id}`);
  },

  setFavorite: (slug) => {
    setHeader(true);
    return axios.post(`${baseUrl}/articles/${slug}/favorite`);
  },

  unSetFavorite: (slug) => {
    setHeader(true);
    return axios.delete(`${baseUrl}/articles/${slug}/favorite`);
  },

  setFollow: (username) => {
    setHeader(true);
    return axios.post(`${baseUrl}/profiles/${username}/follow`);
  },

  unSetFollow: (username) => {
    setHeader(true);
    return axios.delete(`${baseUrl}/profiles/${username}/follow`);
  }

};
export default {
  Request
};
