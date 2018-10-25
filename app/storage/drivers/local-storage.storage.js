class LocalStorageStorage {
  constructor() {
    this.prefix = 'wn:';
    this.storage = window.localStorage;
  }

  get(key) {
    const value = this.storage.getItem(this._computeKey(key));
    return JSON.parse(value) || {};
  }

  set(key, value) {
    return this.storage.setItem(this._computeKey(key), JSON.stringify(value));
  }

  getKeys() {
    return Object.keys(this.storage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.slice(this.prefix.length));
  }

  _computeKey(key) {
    return `${this.prefix}${key}`;
  }
}

export default LocalStorageStorage;
