import { set as _set, get as _get } from 'lodash-es';
import StateStorage from './state.storage';

class MemoryStorage extends StateStorage {
  constructor(documentState) {
    super(documentState);
    this.storage = {};
  }

  get(store, key) {
    return _get(this.storage, [store, key], {});
  }

  set(store, key, value) {
    return _set(this.storage, [store, key], value);
  }

  getKeys(store) {
    return Object.keys(this.storage[store]);
  }
}

export default MemoryStorage;
