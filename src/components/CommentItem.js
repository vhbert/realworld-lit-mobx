import {Base} from "./Base";
import {html} from "lit-html";

let _store;
class CommentItem extends Base {

  static properties = {
    comment: {type: Object},
    articleSlug: {type: String},
    isDeleting: {type: Boolean}
  };

  connectedCallback() {
    super.connectedCallback();
    _store = this.context.stores;
  }

  deleteComment = () => {
    this.isDeleting = true;
    _store.articleStore.deleteComment(this.articleSlug, this.comment.id).then(() => {
      this.isDeleting = false;
    });
  };

  isCommentFromUser() {
    if (_store.authStore.activeUser) {
      return _store.authStore.activeUser.username === this.comment.author.username;
    } else {
      return false;
    }
  }

  render() {
    return html`    
     <div class="card" >
        <div class="card-block">
          <p class="card-text">${this.comment.body}</p>
        </div>
        <div class="card-footer " routerlinks>
          <a route="profile" param-username="${this.comment.author.username}" class="comment-author">
            <img src="${this.comment.author.image}" class="comment-author-img"  alt="Author"/>
          </a>            &nbsp;
          <a href="" class="comment-author">${this.comment.author.username}</a>
          <span class="date-posted">${this.comment.createdAt}</span>           
          ${this.isCommentFromUser() ? html`
          <span class="mod-options">
          ${this.isDeleting ?
              html`<loading-spinner margin="0" size="24px" ></loading-spinner>` :
              html`<i class="ion-trash-a" @click="${this.deleteComment}"></i>`}
          </span>`:''}
        </div>
     </div>`;
  }
}
customElements.define("comment-item", CommentItem);