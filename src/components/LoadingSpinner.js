import {Base, styleMap} from "./Base";
import {html} from "lit-html";
import {property} from "lit-element";


class LoadingSpinner extends Base {
  @property({type: String}) margin;
  @property({type: String}) size;
  @property({type: Object}) style = {
  "border-radius": "50%",
  "width": "40px",
  "height": "40px",
  "margin": "50% auto",
  "position": "relative",
  "border-top": "3px solid rgba(0, 0, 0, 0.1)",
  "border-right": "3px solid rgba(0, 0, 0, 0.1)",
  "border-bottom": "3px solid rgba(0, 0, 0, 0.1)",
  "border-left": "3px solid #818a91",
  "transform": "translateZ(0)",
  "animation": "loading-spinner 0.5s infinite linear"
  };


  render() {
    this.style.margin = this.margin ? this.margin + ' auto' : "50% auto";
    this.style.width = this.style.height = this.size ? this.size : "40px";
    return html`
      <div class="loading-spinner" style=${styleMap(this.style)}></div>
       <style>
          @keyframes loading-spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        </style>
    `;
  }
}

customElements.define('loading-spinner', LoadingSpinner);
