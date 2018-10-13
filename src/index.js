import Editor from './editor';
import { DocumentState, Action } from './document/document.state';
import DocumentStorage from './document/document.storage';
import MemoryStorage from './storage/memory.storage';
import HashListener from './page/hash-listener';
import NavElement from './nav/nav.element';

window.customElements.define('wn-nav', NavElement);

DocumentStorage.storageDriver = () => new MemoryStorage();

const docState = new DocumentState();

docState.register([
  DocumentStorage,
  HashListener,
]);

new Editor(docState, '#quill-container').focus();

const nav = document.querySelector('wn-nav');
docState.select('history').subscribe((history) => {
  nav.history = history;
})
