import { LitElement, html } from '@polymer/lit-element';

import NavComponent from '../../components/nav/nav.component';
import QuillEditorComponent from '../../components/quill-editor/quill-editor.component';
import HashListenerComponent from '../../components/hash-listener/hash-listener.component';
import { Action } from '../../../app.state';

window.customElements.define('wn-nav', NavComponent);
window.customElements.define('wn-hash-listener', HashListenerComponent);
window.customElements.define('wn-quill-editor', QuillEditorComponent);

class EditorComponent extends LitElement {
  static get properties() {
    return {
      state: Object,
      readOnly: Boolean,
      document: Array,
      history: Array,
    };
  }

  firstUpdated() {
    this.nav = this.querySelector('wn-nav');

    this.state.select('history').subscribe(history => (this.history = history));
    this.state.select('title').subscribe(title => (this.title = title));
    this.state.select('readOnly').subscribe(readOnly => (this.readOnly = readOnly));
    this.state.select('document').subscribe(document => (this.document = document));
  }

  createRenderRoot() {
    return this;
  }

  _onHashChange(event) {
    this.state.dispatch(
      new Action('DOCUMENT_SELECTED', {
        title: event.detail.title,
      }),
    );
  }

  _onDocumentUpdate(event) {
    this.state.dispatch(
      new Action('DOCUMENT_UPDATED', {
        title: this.title,
        document: event.detail.document,
      }),
    );
  }

  render() {
    return html`
      <wn-nav .history="${this.history}">
      </wn-nav>

      <wn-hash-listener @hashchange="${this._onHashChange}">
      </wn-hash-listener>

      <wn-quill-editor
        .readOnly="${this.readOnly}"
        .document="${this.document}"
        @documentUpdate="${this._onDocumentUpdate.bind(this)}">
      </wn-quill-editor>
    `;
  }
}

export default EditorComponent;
