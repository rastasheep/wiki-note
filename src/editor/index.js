import Quill from 'quill';
import { debounce } from 'lodash-es';

import AutoLink from './modules/auto-link';
import ClickableLinks from './modules/clickable-links';
import Link from './formats/link';

import 'quill/dist/quill.bubble.css';
import { Action } from '../document/document.state';

Quill.register({
  'formats/link': Link,
  'modules/clickableLink': ClickableLinks,
  'modules/autoLink': AutoLink,
});

class Editor {
  constructor(docState, selector) {
    this.docState = docState;
    this.selector = selector;

    this.docState.select('title').subscribe(docTitle => (this.docTitle = docTitle));
    this.docState.actions.subscribe(action => {
      switch (action.type) {
        case 'DOCUMENT_LOADED':
          this.instance.enable(!action.payload.readOnly);
          this.instance.setContents(action.payload.document);
          break;
      }
    });

    this.instance = new Quill(this.selector, {
      theme: 'bubble',
      syntax: true,
      modules: {
        clickableLink: true,
        autoLink: true,
        toolbar: [
          ['bold', 'italic', 'link'],
          [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],
        ],
      },
    });

    this.instance.on('text-change', debounce(this.onTextChange.bind(this), 500));
  }

  onTextChange(delta, oldContents, source) {
    if (source === 'api') {
      return;
    }

    this.docState.dispatch(
      new Action('DOCUMENT_UPDATED', {
        title: this.docTitle,
        document: this.instance.getContents(),
      }),
    );
  }

  focus() {
    this.instance.focus();
  }
}

export default Editor;
