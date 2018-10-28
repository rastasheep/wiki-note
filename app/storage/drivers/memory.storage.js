import { set as _set, get as _get, pick as _pick, unset as _unset } from 'lodash-es';
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

  unset(store, key) {
    return _unset(this.storage, [store, key]);
  }

  pick(store, keys) {
    const data = this.storage[store] || {};
    return Object.keys(data).map(key => _pick(data[key], keys));
  }
}

export default MemoryStorage;
