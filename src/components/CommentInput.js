import {Base} from "./Base";
import {html} from "lit-html";

let _store;
class CommentInput extends Base {

  static properties = {
    article: {type: Object},
    commentBody: {type: String},
    isPosting: {type: Boolean}
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  createComment = (e) => {
    e.preventDefault();
    this.isPosting = true;
    _store.articleStore.addComment(this.article.slug, {comment: {body: this.commentBody}}).then(() => {
      _store.articleStore.getComments(this.article.slug);
      this.commentBody = "";
      this.isPosting = false;
    }).catch(err => console.log(err));
  };

  handleContentInput = (e) => {
    this.commentBody = e.target.value;
  };

  render() {

    if (_store.authStore.activeUser) {
      let currentUser = _store.authStore.activeUser;
      return html`
        <form class="card comment-form">
          <div class="card-block">
            ${this.isPosting ? 
            html`<loading-spinner margin="40px" ></loading-spinner>` :
            html`<textarea class="form-control"
                        placeholder="Write a comment..."
                        rows="3"
                        @input="${this.handleContentInput}"
                        value="${this.commentBody}"></textarea>`}
          </div>
          <div class="card-footer">
            <img src="${currentUser.image}" class="comment-author-img"  alt=""/>
            <button class="${this.isPosting ? 'disabled' : ''} btn btn-sm btn-primary" @click="${this.createComment}">
                Post Comment
            </button>
          </div>
        </form>  
        `;
    } else {
      return html`<div class="card-block">Please log in to post a comment</div>`;
    }
  }
}
customElements.define("comment-input", CommentInput);