import Quill from 'quill';

import AutoLink from './modules/auto-link';
import ClickableLinks from './modules/clickable-links';
import Link from './formats/link';

import 'quill/dist/quill.bubble.css';

Quill.register({
  'formats/link': Link,
  'modules/clickableLink': ClickableLinks,
  'modules/autoLink': AutoLink,
});

class Editor {
  constructor(selector) {
    this.selector = selector;

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
      }
    });
  }

  focus() {
    this.instance.focus();
  }
}

export default Editor;
