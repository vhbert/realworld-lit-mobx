import {Base} from "../components/Base";
import {html} from "lit-html";
import {toJS} from "mobx";

let _store;

export default class EditorView extends Base {
  constructor() {
    super();
    this.article = {
      title: '',
      description: '',
      body: '',
      tagList: []
    };
  }

  static properties = {
    slug: {type: String},
    article: {type: Object}
  };

  set $route(value) {
    this.slug = value.params.slug;
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('slug')) {
      _store.articleStore.getArticle(this.slug);
    }
    return true;
  }

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  updateEntry = (entry) => {
    return (ev) => {
      switch (entry) {
        case "tagList":
          this.article.tagList = ev.target.value.length === 0 ? [] : ev.target.value.split(" ");
          break;
        default:
          this.article[entry] = ev.target.value;
          break;
      }
    };
  };

  submitForm = (e) => {
    e.preventDefault();
    if (this.slug) {
      _store.articleStore.updateArticle(this.slug, this.article).then((res) => {
        _store.articleStore.getArticle(this.slug, false);
        this.$router.replaceWith('article', {slug: res.slug});
      });
    } else {
      _store.articleStore.createArticle(this.article).then(() => this.$router.replaceWith('home')).catch(err => {
      });
    }
  };

  render() {
    const authErrors = _store.authStore.authErrors;
    let formattedErrors = [];
    Object.keys(authErrors).map(key => {
      for (const i in authErrors[key]) {
        formattedErrors.push(`${key} ${authErrors[key][i]}`);
      }
    });

    if (this.slug) {
      this.article = _store.articleStore.activeArticle;
    }
    let article = this.article;

    return html`
    <div class="editor-page">
      <div class="container page">
        <div class="row">  
          <div class="col-md-10 offset-md-1 col-xs-12">
          <error-list .errors=${formattedErrors}></error-list>   
            <form>
              <fieldset>
                <fieldset class="form-group">
                    <input .value="${article.title || ''}" type="text" class="form-control form-control-lg" placeholder="Article Title"
                          @change=${this.updateEntry('title')}>
                </fieldset>
                <fieldset class="form-group">
                    <input .value="${article.description || ''}" type="text" class="form-control" placeholder="What's this article about?"
                          @change=${this.updateEntry('description')}>
                </fieldset>
                <fieldset class="form-group">
                    <textarea .value="${article.body || ''}" class="form-control" rows="8" placeholder="Write your article (in markdown)"
                          @change=${this.updateEntry('body')}></textarea>
                </fieldset>
                <fieldset class="form-group">
                    <input type="text" class="form-control" placeholder="Enter tags"               
                          @change=${this.updateEntry('tagList')}>
                    <div class="tag-list"></div>
                </fieldset>              
                <button class="btn btn-lg pull-xs-right btn-primary" @click="${this.submitForm}" type="button">
                   ${this.slug ? html`Update Article` : html`Publish Article`} 
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define("editor-view", EditorView);