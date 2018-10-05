import Editor from './editor';
import { DocumentState, Action } from './document/document.state';
import DocumentStorage from './document/document.storage';
import MemoryStorage from './storage/memory.storage';

DocumentStorage.storageDriver = () => new MemoryStorage();

const docState = new DocumentState();

docState.register([
  DocumentStorage
  //   HashListener
]);

new Editor(docState, '#quill-container').focus();

// HashListener
docState.dispatch(new Action('DOCUMENT_SELECTED', { title: location.hash || '#' }));
window.addEventListener(
  'hashchange',
  () => {
    docState.dispatch(new Action('DOCUMENT_SELECTED', { title: location.hash || '#' }));
  },
  false
);
