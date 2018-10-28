import AppComponent from '../app.component';
import LocalStorageStorage from '../storage/drivers/local-storage.storage';
import IndexedDbStorage from '../storage/drivers/indexeddb.storage';
import MemoryStorage from '../storage/drivers/memory.storage';

class ChromeAppComponent extends AppComponent {
  constructor() {
    super();

    this.state.register([IndexedDbStorage]);
  }
}

window.customElements.define('wn-app', ChromeAppComponent);

export default ChromeAppComponent;
