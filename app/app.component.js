import { LitElement, html } from '@polymer/lit-element';

import { DocumentState } from './app.state';
import StateStorage from './storage/state.storage';
import EditorComponent from './editor/containers/editor/editor.component';

window.customElements.define('wn-editor', EditorComponent);

class AppComponent extends LitElement {
  constructor() {
    super();

    this.state = new DocumentState();
    this.state.register([StateStorage]);
  }

  firstUpdated() {
    this.querySelector('wn-editor').state = this.state;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <wn-editor>
      </wn-editor>
    `;
  }
}

export default AppComponent;
