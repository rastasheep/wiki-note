import { Action } from '../document/document.state';

class HashListener {
  constructor(state) {
    this.state = state;
    this.window = window;

    this._onDocumentSelected(window.location.hash);
    this.window.addEventListener('hashchange', this._onHashChange.bind(this));
  }

  _onHashChange(event) {
    this._onDocumentSelected(event.currentTarget.location.hash);
  }

  _onDocumentSelected(title) {
    this.window.document.title = `${title ? title + ' - ' : ''}WikiNote`;
    this.state.dispatch(new Action('DOCUMENT_SELECTED', { title: title || '#' }));
  }
}

export default HashListener;
