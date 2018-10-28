import Module from 'quill/core/module';

class AutoLink extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill.on('text-change', this.onTextChange.bind(this));
    if (this.quill.clipboard) {
      this.quill.clipboard.addMatcher(Node.TEXT_NODE, this.onPaste.bind(this));
    }
  }

  static isWhitespace(character) {
    return [' ', '\t', '\n'].includes(character);
  }

  onTextChange(delta, oldDelta, source) {
    const regex = /https?:\/\/[^\s]+$|\#[A-Za-z0-9_-]+$/;
    if (
      delta.ops.length === 2 &&
      delta.ops[0].retain &&
      this.constructor.isWhitespace(delta.ops[1].insert)
    ) {
      const endRetain = delta.ops[0].retain;
      const match = this.quill
        .getText()
        .substr(0, endRetain)
        .match(regex);

      if (!match) {
        return;
      }
      const url = match[0];

      var ops = [];
      if (endRetain > url.length) {
        ops.push({ retain: endRetain - url.length });
      }

      ops.push({ delete: url.length }, { insert: url, attributes: { link: url } });

      this.quill.updateContents({ ops });
    }
  }

  onPaste(node, delta) {
    const { data } = node;
    const regex = /https?:\/\/[^\s]+/g;

    if (typeof data !== 'string') {
      return;
    }
    const matches = data.match(regex);

    if (matches && matches.length > 0) {
      const ops = [];
      let str = data;
      matches.forEach(match => {
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

export default AutoLink;
