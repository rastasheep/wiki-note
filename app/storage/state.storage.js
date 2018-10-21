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
      let document;
      const title = action.payload.title;

      switch (action.type) {
        case 'DOCUMENT_SELECTED':
          if (title === '#index') {
            document = this._loadIndexDocument();
          } else {
            document = this.storageDriver.get(title);
          }

          this.documentState.dispatch(
            new Action('DOCUMENT_LOADED', {
              ...{
                title,
                readOnly: false,
                starred: false,
                content: [],
              },
              ...document,
            }),
          );
          break;
        case 'DOCUMENT_UPDATED':
          document = {
            ...action.payload,
            updatedAt: Date.now(),
          };

          this.storageDriver.set(title, document);
          break;
      }
    });
  }

  _loadIndexDocument() {
    const titles = this.storageDriver.getKeys().sort();
    const groupedTitles = groupBy(titles, item => item[1]);

    const ops = [
      { attributes: { bold: true }, insert: 'INDEX' },
      { attributes: { blockquote: true }, insert: '\n' },
      { insert: '\n' },
    ];

    for (var key in groupedTitles) {
      if (key !== 'undefined') {
        ops.push(...[{ insert: key.toUpperCase() }, { attributes: { bold: true }, insert: '\n' }]);
      }

      groupedTitles[key].forEach(title =>
        ops.push({ attributes: { link: title }, insert: `${title}\n` }),
      );

      ops.push({ insert: '\n' });
    }

    return {
      title: '#index',
      readOnly: true,
      content: { ops },
    };
  }
}

export default StateStorage;
