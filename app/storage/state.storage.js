import { groupBy } from 'lodash-es';
import { Action } from '../app.state';

class StateStorage {
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
          const title = action.payload.title;

          let document;
          let readOnly = false;
          if (title === '#index') {
            document = this._loadIndexDocument();
            readOnly = true;
          } else {
            document = this.storageDriver.get(action.payload.title);
          }

          this.documentState.dispatch(
            new Action('DOCUMENT_LOADED', {
              title: action.payload.title,
              readOnly,
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

  _loadIndexDocument() {
    const titles = this.storageDriver.getKeys().sort();
    const groupedTitles = groupBy(titles, item => item[1]);

    const document = [
      { attributes: { bold: true }, insert: 'INDEX' },
      { attributes: { blockquote: true }, insert: '\n' },
      { insert: '\n' },
    ];

    for (var key in groupedTitles) {
      if (key !== 'undefined') {
        document.push(
          ...[{ insert: key.toUpperCase() }, { attributes: { bold: true }, insert: '\n' }],
        );
      }

      groupedTitles[key].forEach(title =>
        document.push({ attributes: { link: title }, insert: `${title}\n` }),
      );

      document.push({ insert: '\n' });
    }

    return { ops: document };
  }
}

export default StateStorage;
