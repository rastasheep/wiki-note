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

  getKeys(store) {
    const storeKey = this._computeKey(store);
    return Object.keys(this.storage)
      .filter(key => key.startsWith(storeKey))
      .map(key => key.slice(storeKey.length + 1));
  }

  _computeKey(store, key) {
    return key ? `${this.prefix}:${store}:${key}` : `${this.prefix}:${store}`;
  }
}

export default LocalStorageStorage;
