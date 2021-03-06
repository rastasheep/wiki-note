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

  unset(store, key) {
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
        const defaultDoc = {
          title,
          readOnly: false,
          starred: false,
          content: [],
        };

        this.documentState.dispatch(
          new Action('DOCUMENT_LOADED', {
            document: Object.assign({}, defaultDoc, document),
          }),
        );
        break;
      case 'DOCUMENT_UPDATED':
        document = action.payload.document;
        document.updatedAt = Date.now();

        if (
          typeof document.content.length !== 'undefined' &&
          (document.content.length < 1 || document.content.length() <= 1) &&
          !document.starred
        ) {
          this.documentState.dispatch(
            new Action('DOCUMENT_DELETED', {
              title: document.title,
            }),
          );
          this.unset('documents', document.title);
          break;
        }

        this.set('documents', document.title, document);
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
