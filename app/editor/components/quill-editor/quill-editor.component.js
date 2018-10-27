import { LitElement, html } from '@polymer/lit-element';
import { debounce, xorWith, isEqual } from 'lodash-es';
import Quill from 'quill/core';

import { IndentClass as Indent } from 'quill/formats/indent';
import Blockquote from 'quill/formats/blockquote';
import Header from 'quill/formats/header';
import List, { ListItem } from 'quill/formats/list';
import { BackgroundClass, BackgroundStyle } from 'quill/formats/background';
import { ColorClass, ColorStyle } from 'quill/formats/color';
import { FontClass, FontStyle } from 'quill/formats/font';
import { SizeClass, SizeStyle } from 'quill/formats/size';
import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Script from 'quill/formats/script';
import Strike from 'quill/formats/strike';
import Underline from 'quill/formats/underline';
import Image from 'quill/formats/image';
import Video from 'quill/formats/video';
import CodeBlock, { Code as InlineCode } from 'quill/formats/code';
import Formula from 'quill/modules/formula';
import Toolbar from 'quill/modules/toolbar';
import Tooltip from 'quill/ui/tooltip';

import AutoLink from './modules/auto-link';
import ClickableLinks from './modules/clickable-links';
import MarkdownShortcuts from './modules/markdown-shortcuts';
import Link from './formats/link';
import HorizontalRule from './formats/hr';
import BubbleTheme from './themes/bubble';
import Icons from './themes/icons';

Quill.register(
  {
    'attributors/class/background': BackgroundClass,
    'attributors/class/color': ColorClass,
    'attributors/class/font': FontClass,
    'attributors/class/size': SizeClass,

    'attributors/style/background': BackgroundStyle,
    'attributors/style/color': ColorStyle,
    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,

    'formats/indent': Indent,
    'formats/background': BackgroundStyle,
    'formats/color': ColorStyle,
    'formats/font': FontClass,
    'formats/size': SizeClass,
    'formats/blockquote': Blockquote,
    'formats/code-block': CodeBlock,
    'formats/header': Header,
    'formats/list': List,
    'formats/list/item': ListItem,
    'formats/bold': Bold,
    'formats/code': InlineCode,
    'formats/italic': Italic,
    'formats/script': Script,
    'formats/strike': Strike,
    'formats/underline': Underline,
    'formats/image': Image,
    'formats/video': Video,

    'modules/formula': Formula,
    'modules/toolbar': Toolbar,

    'themes/bubble': BubbleTheme,

    'ui/icons': Icons,
    'ui/tooltip': Tooltip,
  },
  true,
);

Quill.register({
  'formats/link': Link,
  'formats/horizontal': HorizontalRule,
  'modules/clickableLink': ClickableLinks,
  'modules/autoLink': AutoLink,
  'modules/markdownShortcuts': MarkdownShortcuts,
});

class QuillEditor extends LitElement {
  static get properties() {
    return {
      readOnly: Boolean,
      content: Array,
    };
  }

  set readOnly(value) {
    if (this.instance) {
      this.instance.enable(!value);
    }
  }

  set content(content) {
    if (!this.instance) {
      return;
    }

    if (xorWith(content ? content.ops : [], this.instance.getContents().ops, isEqual).length > 0) {
      this.instance.setContents(content);
      this.focus();
    }
  }

  firstUpdated() {
    this.element = this.querySelector('#quill-container');

    this.instance = new Quill(this.element, {
      theme: 'bubble',
      syntax: true,
      scrollingContainer: '#scrolling-container',
      modules: {
        clickableLink: true,
        autoLink: true,
        markdownShortcuts: true,
      },
    });

    this.instance.on('text-change', debounce(this.onTextChange.bind(this), 500));
  }

  createRenderRoot() {
    return this;
  }

  onTextChange(delta, oldContents, source) {
    if (source === 'api') {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('contentUpdate', { detail: { content: this.instance.getContents() } }),
    );
  }

  focus(event) {
    if (this.instance.hasFocus()) {
      return;
    }
    this.instance.setSelection(
      this.instance.getLength()
    );
  }

  onEditorClick(event) {
    if (vent.currentTarget.classList.contains('ql-bubble')) {
      return;
    }
    this.focus();
  }

  render() {
    return html`
      <style>
        #quill-container {
          height: auto;
          min-height: 100%;
          max-width: 1000px;
          margin: auto;
          padding: 0 50px;
        }

        #quill-container .ql-editor {
          font-size: 18px;
          overflow-y: visible;
        }

        #scrolling-container {
          height: calc(100% - 50px);
          overflow-y: auto;
          padding-top: 50px;
        }
      </style>

      <div id="scrolling-container">
        <div
          @click="${this.onEditorClick.bind(this)}"
          id="quill-container">
        </div>
      </div>
    `;
  }
}

export default QuillEditor;
