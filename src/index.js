import Editor from './editor';
import { DocumentState, Action } from './document/docuemnt.state';

const store = new DocumentState();

new Editor('#quill-container').focus();

store.dispatch(new Action('SET', { title: location.hash }));
window.addEventListener('hashchange', () => {
  store.dispatch(new Action('UPDATE', { title: location.hash }));
}, false);
