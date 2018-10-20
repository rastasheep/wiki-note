import Quill from 'quill/core';
import Module from 'quill/core/module';

class MarkdownShortcuts extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill.on('text-change', this.onTextChange.bind(this));
  }

  onTextChange(delta, oldDelta, source) {
    for (let i = 0; i < delta.ops.length; i++) {
      if (delta.ops[i].hasOwnProperty('insert')) {
        this.onInsert();
      }
    }
  }

  onInsert() {
    const selection = this.quill.getSelection();
    if (!selection) {
      return;
    }

    const [leaf] = this.quill.getLeaf(selection.index);
    if (leaf.parent && ['code-block', 'code'].includes(leaf.parent.constructor.blotName)) {
      return;
    }

    const [line, offset] = this.quill.getLine(selection.index);
    const text = line.domNode.textContent;
    const lineStart = selection.index - offset;
    if (!text) {
      return;
    }

    for (let matcher of MARKDOWN_MATCHERS) {
      if (text.match(matcher.pattern)) {
        console.log('matched:', matcher.name, text);
        matcher.action(this.quill, text, selection, matcher.pattern, lineStart);
        return;
      }
    }
  }
}

const MARKDOWN_MATCHERS = [
  {
    name: 'header',
    pattern: /^(#){1,6}\s+$/g,
    action: (quill, text, selection, pattern) => {
      const match = pattern.exec(text);
      if (!match) return;
      const size = match[0].length;
      quill.formatLine(selection.index, 0, 'header', size - 1);
      quill.deleteText(selection.index - size, size);
    },
  },
  {
    name: 'blockquote',
    pattern: /^(>)\s/g,
    action: (quill, text, selection) => {
      quill.formatLine(selection.index, 1, 'blockquote', true);
      quill.deleteText(selection.index - 2, 2);
    },
  },
  {
    name: 'code-block',
    pattern: /^`{3}$/g,
    action: (quill, text, selection) => {
      quill.formatLine(selection.index, 1, 'code-block', true);
      quill.deleteText(selection.index - 3, 3);
    },
  },
  {
    name: 'hr',
    pattern: /^([-*]\s?){3}/g,
    action: (quill, text, selection) => {
      const startIndex = selection.index - text.length;
      quill.deleteText(startIndex, text.length);

      //quill.insertText(startIndex, '\n', Quill.sources.USER);
      quill.insertEmbed(startIndex, 'divider', true, Quill.sources.USER);
      quill.setSelection(startIndex + 2, Quill.sources.SILENT);
    },
  },
  {
    name: 'bolditalic',
    pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
    action: (quill, text, selection, pattern, lineStart) => {
      let match = pattern.exec(text);

      const annotatedText = match[0];
      const matchedText = match[1];
      const startIndex = lineStart + match.index;

      if (text.match(/^([*_ \n]+)$/g)) return;

      quill.deleteText(startIndex, annotatedText.length);
      quill.insertText(startIndex, matchedText, { bold: true, italic: true });
      quill.format('bold', false);
    },
  },
  {
    name: 'bold',
    pattern: /(?:\*|_){2}(.+?)(?:\*|_){2}/g,
    action: (quill, text, selection, pattern, lineStart) => {
      let match = pattern.exec(text);

      const annotatedText = match[0];
      const matchedText = match[1];
      const startIndex = lineStart + match.index;

      if (text.match(/^([*_ \n]+)$/g)) return;
      if (text.match(/^(?:\*|_){3}/g)) return;

      quill.deleteText(startIndex, annotatedText.length);
      quill.insertText(startIndex, matchedText, { bold: true });
      quill.format('bold', false);
    },
  },
  {
    name: 'italic',
    pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
    action: (quill, text, selection, pattern, lineStart) => {
      let match = pattern.exec(text);

      const annotatedText = match[0];
      const matchedText = match[1];
      const startIndex = lineStart + match.index;

      if (text.match(/^([*_ \n]+)$/g)) return;
      if (text.match(/^(?:\*|_){2}/g)) return;

      quill.deleteText(startIndex, annotatedText.length);
      quill.insertText(startIndex, matchedText, { italic: true });
      quill.format('italic', false);
    },
  },
  {
    name: 'strikethrough',
    pattern: /(?:~~)(.+?)(?:~~)/g,
    action: (quill, text, selection, pattern, lineStart) => {
      let match = pattern.exec(text);

      const annotatedText = match[0];
      const matchedText = match[1];
      const startIndex = lineStart + match.index;

      if (text.match(/^([*_ \n]+)$/g)) return;

      quill.deleteText(startIndex, annotatedText.length);
      quill.insertText(startIndex, matchedText, { strike: true });
      quill.format('strike', false);
    },
  },
  {
    name: 'code',
    pattern: /(?:`)(.+?)(?:`)/g,
    action: (quill, text, selection, pattern, lineStart) => {
      let match = pattern.exec(text);

      const annotatedText = match[0];
      const matchedText = match[1];
      const startIndex = lineStart + match.index;

      if (text.match(/^([*_ \n]+)$/g)) return;
      if (text.match(/^(?:`+)$/g)) return;

      quill.deleteText(startIndex, annotatedText.length);
      quill.insertText(startIndex, matchedText, { code: true });
      quill.format('code', false);
      quill.insertText(quill.getSelection(), ' ');
    },
  },
  {
    name: 'image',
    pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
    action: (quill, text, selection, pattern) => {
      const startIndex = text.search(pattern);
      const matchedText = text.match(pattern)[0];
      // const hrefText = text.match(/(?:!\[(.*?)\])/g)[0]
      const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
      const start = selection.index - matchedText.length;
      if (startIndex !== -1) {
        quill.deleteText(start, matchedText.length);
        quill.insertEmbed(
          start,
          'image',
          hrefLink.slice(1, hrefLink.length - 1),
          Quill.sources.USER,
        );
        quill.setSelection(start + 1, Quill.sources.SILENT);
      }
    },
  },
  {
    name: 'link',
    pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
    action: (quill, text, selection, pattern) => {
      const startIndex = text.search(pattern);
      const matchedText = text.match(pattern)[0];
      const hrefText = text.match(/(?:\[(.*?)\])/g)[0];
      const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
      const start = selection.index - matchedText.length;
      if (startIndex !== -1) {
        quill.deleteText(start, matchedText.length);
        quill.insertText(
          start,
          hrefText.slice(1, hrefText.length - 1),
          'link',
          hrefLink.slice(1, hrefLink.length - 1),
        );
      }
    },
  },
];

export default MarkdownShortcuts;
