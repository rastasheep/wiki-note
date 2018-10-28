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

  pick(store, keys) {
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
    const titles = await this.pick('documents', ['title', 'starred']);
    const documents = groupBy(titles.sort(), item => item.title[1]);
    const ops = [];

    ops.push(
      ...[
        { attributes: { bold: true }, insert: 'INDEX' },
        { attributes: { blockquote: true }, insert: '\n' },
        { insert: '\n' },
      ],
    );

    for (var letter in documents) {
      if (letter !== 'undefined') {
        ops.push(
          ...[{ insert: letter.toUpperCase() }, { attributes: { bold: true }, insert: '\n' }],
        );
      }

      documents[letter].forEach(document => {
        const style = document.starred ? { background: '#ffa', color: '#555' } : undefined;
        ops.push({
          attributes: { link: document.title, ...style },
          insert: `${document.title}\n`,
        });
      });

      ops.push({ insert: '\n' });
    }

    return {
      title: '#index',
      starred: false,
      readOnly: true,
      content: { ops },
    };
  }
}

export default StateStorage;
