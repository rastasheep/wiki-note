import { LitElement } from '@polymer/lit-element';

class HashListener extends LitElement {
  constructor() {
    super();
    this.window = window;
  }

  firstUpdated() {
    this._onDocumentSelected(window.location.hash);
    this.window.addEventListener('hashchange', this._onHashChange.bind(this));
  }

  _onHashChange(event) {
    this._onDocumentSelected(event.currentTarget.location.hash);
  }

  _onDocumentSelected(title) {
    this.window.document.title = `${title ? title + ' - ' : ''}WikiNote`;
    this.dispatchEvent(new CustomEvent('hashchange', { detail: { title: title || '#' } }));
  }
}

export default HashListener;
