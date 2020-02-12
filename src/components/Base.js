import {MobxLitElement} from "@adobe/lit-mobx";
import {withContext} from "wc-context/lit-element";
import {styleMap} from 'lit-html/directives/style-map';
import {withRouterLinks} from "../router";

class Base extends withRouterLinks(withContext(MobxLitElement)) {
  static observedContexts = ['stores'];

  createRenderRoot() {
    return this;
  }
}

export {Base, styleMap};