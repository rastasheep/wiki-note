import { Action } from './document.state';

class DocumentStorage {
  static storageDriver() {
    // TODO: do we need default storage driver? memory storage?
  }

  constructor(documentState) {
    this.documentState = documentState;
    this.storageDriver = this.constructor.storageDriver();

    this.observeState(this.documentState.actions);
  }

  observeState(actions) {
    actions.subscribe(action => {
      switch (action.type) {
        case 'DOCUMENT_SELECTED':
          const document = this.storageDriver.get(action.payload.title);
          this.documentState.dispatch(
            new Action('DOCUMENT_LOADED', {
              title: action.payload.title,
              document,
            }),
          );
          break;
        case 'DOCUMENT_UPDATED':
          this.storageDriver.set(action.payload.title, action.payload.document);
          break;
      }
    });
  }
}

export default DocumentStorage;
