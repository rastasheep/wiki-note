import StateStorage from './state.storage';

class MemoryStorage extends StateStorage {
  constructor(documentState) {
    super(documentState);
    this.storage = {};
  }

  get(key) {
    return this.storage[key] || {};
  }

  set(key, value) {
    return (this.storage[key] = value);
  }

  getKeys() {
    return Object.keys(this.storage);
  }
}

export default MemoryStorage;
