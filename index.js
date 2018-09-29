import Quill from 'quill';

import 'quill/dist/quill.bubble.css';

const Link = Quill.import('formats/link');

class CustomLink extends Link {
  static sanitize(url) {
    return url;
  }

  static create(value) {
    const node = super.create(value);
    if (value.startsWith('#')) {
      node.removeAttribute('target');
    }
    return node;
  }
}

class ClickableLinks {
  constructor(quill) {
    this.currentLink;
    quill.container.addEventListener('mouseover', this.onMouseOver.bind(this));
  }

  onMouseOver(event) {
    if (event.target.tagName === 'A') {
      this.currentLink = event.target;
      this.currentLink.setAttribute('contenteditable', false);
    } else if (this.currentLink) {
      this.currentLink.removeAttribute('contenteditable');
      this.currentLink = null;
    }
  }
}

class AutoLink {
  constructor(quill) {
    quill.on('text-change', this.onTextChange.bind(this));
    if (quill.clipboard) {
      quill.clipboard.addMatcher(Node.TEXT_NODE, this.onPaste.bind(this));
    }
  }

  static isWhitespace(character) {
    return [' ', '\t', '\n'].includes(character);
  }

  onTextChange(delta, oldDelta, source) {
    const regex = /https?:\/\/[^\s]+$|\#\w+$/;
    if (
      delta.ops.length === 2 &&
      delta.ops[0].retain &&
      this.constructor.isWhitespace(delta.ops[1].insert)
    ) {
      const endRetain = delta.ops[0].retain;
      const match = quill.getText().substr(0, endRetain).match(regex);

      if (!match) {
        return;
      }
      const url = match[0];

      var ops = [];
      if (endRetain > url.length) {
        ops.push({ retain: endRetain - url.length });
      }

      ops.push(
        { delete: url.length },
        { insert: url, attributes: { link: url } },
      );

      quill.updateContents({ ops });
    }
  }

  onPaste(node, delta) {
    const { data } = node;
    const regex = /https?:\/\/[^\s]+/g;

    if (typeof (data) !== 'string') {
      return;
    }
    const matches = data.match(regex);

    if (matches && matches.length > 0) {
      const ops = [];
      let str = data;
      matches.forEach((match) => {
        var split = str.split(match);
        var beforeLink = split.shift();
        ops.push({ insert: beforeLink });
        ops.push({ insert: match, attributes: { link: match } });
        str = split.join(match);
      });
      ops.push({ insert: str });
      delta.ops = ops;
    }

    return delta;
  }
}

Quill.register({
  'formats/link': CustomLink,
  'modules/clickableLink': ClickableLinks,
  'modules/autoLink': AutoLink,
});

const quill = new Quill('#quill-container', {
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
quill.focus();
