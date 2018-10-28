import idb from 'idb';
import StateStorage from './state.storage';

class IndexedDbStorage extends StateStorage {
  constructor(documentState) {
    super(documentState);
    this.dbName = 'wn';
    this.dbVersion = 1;

    if (!('indexedDB' in window)) {
      throw new Error("This browser doesn't support IndexedDB");
    }

    this.db = idb.open(this.dbName, this.dbVersion, upgradeDb => {
      if (!upgradeDb.objectStoreNames.contains('documents')) {
        const documentsOS = upgradeDb.createObjectStore('documents', { keyPath: 'title' });
        documentsOS.createIndex('starred', 'starred', { unique: false });
        documentsOS.createIndex('title', 'title', { unique: true });
      }
    });
  }

  get(store, key) {
    return this.db.then(db => {
      return db
        .transaction(store, 'readonly')
        .objectStore(store)
        .get(key);
    });
  }

  set(store, key, value) {
    return this.db.then(db => {
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .put(value).complete;
    });
  }

  getKeys(store, key) {
    return this.db.then(db => {
      return db
        .transaction(store, 'readonly')
        .objectStore(store)
        .index(key)
        .getAllKeys();
    });
  }

  _computeKey(key) {
    return `${this.prefix}${key}`;
  }
}

export default IndexedDbStorage;
