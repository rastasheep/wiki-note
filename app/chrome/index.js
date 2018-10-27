import AppComponent from '../app.component';
import LocalStorageStorage from '../storage/drivers/local-storage.storage';

class ChromeAppComponent extends AppComponent {
  constructor() {
    super();

    this.state.register([LocalStorageStorage]);
  }
}

window.customElements.define('wn-app', ChromeAppComponent);

export default ChromeAppComponent;
