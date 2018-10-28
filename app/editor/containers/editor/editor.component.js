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
      content: Array,
      history: Array,
    };
  }

  firstUpdated() {
    this.nav = this.querySelector('wn-nav');

    this.state.select('history').subscribe(history => (this.history = history));
    this.state.select('title').subscribe(title => (this.title = title));
    this.state.select('readOnly').subscribe(readOnly => (this.readOnly = readOnly));
    this.state.select('starred').subscribe(starred => (this.starred = starred));
    this.state.select('content').subscribe(content => (this.content = content));
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
    if (this.readOnly) {
      return;
    }
    const doc = event.detail;

    this.state.dispatch(
      new Action('DOCUMENT_UPDATED', {
        title: doc.title || this.title,
        readOnly: doc.readOnly || this.readOnly,
        starred: typeof doc.isStarred !== 'undefined' ? doc.isStarred : this.starred,
        content: doc.content || this.content,
      }),
    );
  }

  render() {
    return html`
      <wn-nav
        .history="${this.history}"
        .isStarred="${this.starred}"
        @starToggle="${this._onDocumentUpdated.bind(this)}">
      </wn-nav>

      <wn-hash-listener
        @hashchange="${this._onHashChange}">
      </wn-hash-listener>

      <wn-quill-editor
        .readOnly="${this.readOnly}"
        .content="${this.content}"
        @contentUpdate="${this._onDocumentUpdated.bind(this)}">
      </wn-quill-editor>
    `;
  }
}

export default EditorComponent;
