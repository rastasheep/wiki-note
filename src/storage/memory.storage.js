class MemoryStorage {
  constructor() {
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  set(key, value) {
    return (this.storage[key] = value);
  }
}

export default MemoryStorage;
