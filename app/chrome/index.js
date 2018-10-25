import AppComponent from '../app.component';
import StateStorage from '../storage/state.storage';
import LocalStorageStorage from '../storage/drivers/local-storage.storage';

StateStorage.storageDriver = () => new LocalStorageStorage();

window.customElements.define('wn-app', AppComponent);
