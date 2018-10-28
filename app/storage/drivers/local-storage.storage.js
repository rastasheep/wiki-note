import { pick as _pick } from 'lodash-es';
import StateStorage from './state.storage';

class LocalStorageStorage extends StateStorage {
  constructor(documentState) {
    super(documentState);
    this.prefix = 'wn';
    this.storage = window.localStorage;
  }

  get(store, key) {
    const value = this.storage.getItem(this._computeKey(store, key));
    return JSON.parse(value) || {};
  }

  set(store, key, value) {
    return this.storage.setItem(this._computeKey(store, key), JSON.stringify(value));
  }

  unset(store, key) {
    return this.storage.removeItem(this._computeKey(store, key));
  }

  pick(store, keys) {
    const storeKey = this._computeKey(store);
    return Object.keys(this.storage)
      .filter(key => key.startsWith(storeKey))
      .map(key => _pick(JSON.parse(this.storage.getItem(key)), keys));
  }

  _computeKey(store, key) {
    return key ? `${this.prefix}:${store}:${key}` : `${this.prefix}:${store}`;
  }
}

export default LocalStorageStorage;
