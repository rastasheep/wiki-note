import idb from 'idb';
import { pick as _pick } from 'lodash-es';
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

  unset(store, key) {
    return this.db.then(db => {
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .delete(key).complete;
    });
  }

  pick(store, keys) {
    const result = [];
    return this.db.then(db => {
      const tx = db.transaction(store, 'readonly');

      tx.objectStore(store).iterateCursor(cursor => {
        if (!cursor) return;
        result.push(_pick(cursor.value, keys));
        cursor.continue();
      });

      return tx.complete.then(() => result);
    });
  }

  _computeKey(key) {
    return `${this.prefix}${key}`;
  }
}

export default IndexedDbStorage;
