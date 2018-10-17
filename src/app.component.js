import { LitElement, html } from '@polymer/lit-element';

import Editor from './editor';
import { DocumentState, Action } from './document/document.state';
import DocumentStorage from './document/document.storage';
import MemoryStorage from './storage/memory.storage';
import HashListener from './page/hash-listener';

class AppComponent extends LitElement {
  constructor() {
    super();

    DocumentStorage.storageDriver = () => new MemoryStorage();

    this.docState = new DocumentState();
    this.docState.register([DocumentStorage, HashListener]);
  }

  firstUpdated() {
    this.nav = this.querySelector('wn-nav');
    this.docState.select('history').subscribe(history => {
      this.nav.history = history;
    });
    const quillContainer = this.querySelector('#quill-container');

    new Editor(this.docState, quillContainer).focus();
  }

  createRenderRoot() {
    return this;
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
      <wn-nav></wn-nav>

      <div id="scrolling-container">
        <div id="quill-container">
        </div>
      </div>
    `;
  }
}

export default AppComponent;
