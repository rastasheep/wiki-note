import AppComponent from '../app.component';
import StateStorage from '../storage/state.storage';
import MemoryStorage from '../storage/drivers/memory.storage';

StateStorage.storageDriver = () => new MemoryStorage();

window.customElements.define('wn-app', AppComponent);
