import {  Action } from '../document/document.state';

class HashListener {
  constructor(state) {
    this.state = state;

    this._onDocumentSelected(window.location.hash);
    window.addEventListener('hashchange', this._onHashChange.bind(this));
  }

  _onHashChange(event) {
    this._onDocumentSelected(event.currentTarget.location.hash);
  }

  _onDocumentSelected(title) {
    this.state.dispatch(new Action('DOCUMENT_SELECTED', { title: title || '#' }));
  }
}

export default HashListener;
