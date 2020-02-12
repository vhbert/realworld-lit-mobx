import {Base} from "../components/Base";
import {html} from "lit-html";
import { unsafeHTML } from 'lit-html/directives/unsafe-html'
import "../components/ArticleInfo";
import "../components/CommentInput";
import "../components/CommentItem";
import marked from 'marked';

let _store;

class ArticleView extends Base {
  static properties = {
    slug: {type: String},
    pathname: {type: String}
  };

  set $route(value) {
    this.slug = value.params.slug;
    this.pathname = value.pathname;
  }

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
    _store.articleStore.getComments(this.slug);
    _store.articleStore.getArticle(this.slug, true);
  }

  render() {
    const article = _store.articleStore.activeArticle;
    const comments = _store.articleStore.activeComments;
    const markdown = marked(article.body);

    if (_store.commonStore.isLoading)
      return html`<loading-spinner></loading-spinner>`;

    return html`
    <div class="article-page">
       <div class="banner">
          <div class="container">
             <h1>${article.title}</h1>
             <article-info .article="${article}"></article-info>
          </div>
       </div>
       <div class="container page">
          <div class="row article-content">
             <div class="col-md-12">
               ${ unsafeHTML(markdown)}
               <ul class="tag-list">
                  ${article.tagList.map(tag => {return html`
                      <li class="tag-default tag-pill tag-outline">
                        ${tag}
                      </li>
                    `})}
               </ul>
             </div>
          </div>
          <hr/>
          <div class="article-actions">
             <article-info .article="${article}"></article-info>
          </div>
          <div class="row">
             <div class="col-xs-12 col-md-8 offset-md-2">
                <comment-input .article="${article}"></comment-input>
                ${comments.map(comment => {
      return html`<comment-item .articleSlug="${article.slug}" .comment="${comment}"></comment-item>`;
    })}
             </div>
          </div>
       </div>
    </div>  
    `;
  }
}

export default ArticleView;
customElements.define('article-view', ArticleView);