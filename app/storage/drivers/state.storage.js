import { groupBy } from 'lodash-es';
import { Action } from '../../app.state';

class StateStorage {
  constructor(documentState) {
    this.documentState = documentState;
    this.documentState.actions.subscribe(this._onStateChange.bind(this));
  }

  get(store, key) {
    throw new Error('Not Implemented');
  }

  set(store, key, value) {
    throw new Error('Not Implemented');
  }

  getKeys(store, key) {
    throw new Error('Not Implemented');
  }

  async _onStateChange(action) {
    let document;
    const title = action.payload.title;

    switch (action.type) {
      case 'DOCUMENT_SELECTED':
        if (title === '#index') {
          document = await this._loadIndexDocument();
        } else {
          document = await this.get('documents', title);
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

        this.set('documents', title, document);
        break;
    }
  }

  async _loadIndexDocument() {
    const titles = await this.getKeys('documents', 'title');
    const groupedTitles = groupBy(titles.sort(), item => item[1]);

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
