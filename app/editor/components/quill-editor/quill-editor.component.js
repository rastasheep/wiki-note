import { LitElement, html } from '@polymer/lit-element';
import { debounce, xorWith, isEqual } from 'lodash-es';
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

class QuillEditor extends LitElement {
  static get properties() {
    return {
      readOnly: Boolean,
      document: Array,
    };
  }

  set readOnly(value) {
    if (this.instance) {
      this.instance.enable(!value);
    }
  }

  set document(document) {
    if (!this.instance) {
      return;
    }

    if (
      xorWith(document ? document.ops : [], this.instance.getContents().ops, isEqual).length > 0
    ) {
      this.instance.setContents(document);
    }
  }

  firstUpdated() {
    this.element = this.querySelector('#quill-container');

    this.instance = new Quill(this.element, {
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

  createRenderRoot() {
    return this;
  }

  onTextChange(delta, oldContents, source) {
    if (source === 'api') {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('documentUpdate', { detail: { document: this.instance.getContents() } }),
    );
  }

  focus() {
    if (this.instance.hasFocus()) {
      return;
    }
    this.instance.focus();
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
          @click="${this.focus.bind(this)}"
          id="quill-container">
        </div>
      </div>
    `;
  }
}

export default QuillEditor;
