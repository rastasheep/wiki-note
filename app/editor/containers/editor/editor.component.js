import { LitElement, html } from '@polymer/lit-element';

import NavComponent from '../../components/nav/nav.component';
import QuillEditorComponent from '../../components/quill-editor/quill-editor.component';
import HashListenerComponent from '../../components/hash-listener/hash-listener.component';
import { Action } from '../../../app.state';

window.customElements.define('wn-nav', NavComponent);
window.customElements.define('wn-hash-listener', HashListenerComponent);
window.customElements.define('wn-quill-editor', QuillEditorComponent);

class EditorComponent extends LitElement {
  constructor() {
    super();
    this.document = {};
    this.history = [];
  }
  static get properties() {
    return {
      state: Object,
      document: Object,
      history: Array,
    };
  }

  firstUpdated() {
    this.nav = this.querySelector('wn-nav');

    this.state.select('history').subscribe(history => (this.history = history));
    this.state.select('document').subscribe(document => (this.document = document || {}));
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

  _onDocumentUpdated(event) {
    if (this.document.readOnly) {
      return;
    }
    const doc = event.detail;

    this.state.dispatch(
      new Action('DOCUMENT_UPDATED', {
        document: {
          title: doc.title || this.document.title,
          readOnly: doc.readOnly || this.document.readOnly,
          starred: typeof doc.isStarred !== 'undefined' ? doc.isStarred : this.document.starred,
          content: doc.content || this.document.content,
        },
      }),
    );
  }

  render() {
    return html`
      <wn-nav
        .history="${this.history}"
        .isStarred="${this.document.starred}"
        @starToggle="${this._onDocumentUpdated.bind(this)}">
      </wn-nav>

      <wn-hash-listener
        @hashchange="${this._onHashChange}">
      </wn-hash-listener>

      <wn-quill-editor
        .readOnly="${this.document.readOnly}"
        .content="${this.document.content}"
        @contentUpdate="${this._onDocumentUpdated.bind(this)}">
      </wn-quill-editor>
    `;
  }
}

export default EditorComponent;
