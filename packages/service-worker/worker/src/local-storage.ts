/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * Defines a interface to manage key-value object in local storage databases.
 */
export interface AsyncLocalStorage {
  /**
   * Open the connection with database
   *
   */
  open(): Promise<void>;

  /**
   * Close the connection with database
   *
   */
  close(): void;

  /**
   * Clear the database
   *
   */
  clear(): Promise<void>;

  /**
   * Get item by key
   * @param key search id
   */
  getItem(key: string): Promise<string|null>;

  /**
   * Remove an element by id
   * @param key search id
   */
  removeItem(key: string): Promise<void>;

  /**
   * Add or update an item
   * @param key id
   * @param data string of serialized data
   */
  setItem(key: string, data: string): Promise<void>;
}

/**
 * Implementation of local storage over browser indexed database
 */
export class IndexedDbLocalStorage implements AsyncLocalStorage {
  private static DBNAME = 'tlLocalStorage';
  private static DBTABLE = 'storage';

  private database: IDBDatabase|null = null;

  private sessions = 0;

  private initializing: Promise<void>|null = null;

  open(): Promise<void> {
    if (this.database) {
      this.sessions++;
      // @ts-ignore
      return Promise.resolve();
    }

    if (this.initializing) {
      this.sessions++;
      return this.initializing;
    }
    // @ts-ignore
    this.initializing = new Promise<void>((resolve, reject) => {
                          const connection = indexedDB.open(IndexedDbLocalStorage.DBNAME, 1);
                          connection.onsuccess = (ev) => {
                            this.sessions++;
                            this.database = (<any>ev.target).result;
                            resolve();
                          };
                          connection.onerror = reject;
                          connection.onupgradeneeded = e => {
                            const db: IDBDatabase = (<any>e.target).result;
                            db.createObjectStore(IndexedDbLocalStorage.DBTABLE, {keyPath: 'key'});
                          };
                        }).then(() => this.initializing = null, () => {
      this.sessions = 0;
      this.initializing = null;
    });

    // @ts-ignore
    return this.initializing;
  }

  clear(): Promise<void> {
    this.close();
    // @ts-ignore
    return new Promise<void>(((resolve, reject) => {
      const req = indexedDB.deleteDatabase(IndexedDbLocalStorage.DBNAME);
      req.onsuccess = e => resolve();
      req.onerror = reject;
    }));
  }

  getItem(key: string): Promise<string|null> {
    // @ts-ignore
    return new Promise<string|null>(((resolve, reject) => {
      if (this.database) {
        const req = this.database.transaction([IndexedDbLocalStorage.DBTABLE])
                        .objectStore(IndexedDbLocalStorage.DBTABLE)
                        .get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : null);
        req.onerror = reject;
      } else {
        reject(new Error('Connection closed or not open'));
      }
    }));
  }

  removeItem(key: string): Promise<void> {
    // @ts-ignore
    return new Promise<string|null>(((resolve, reject) => {
      if (this.database) {
        const req = this.database.transaction([IndexedDbLocalStorage.DBTABLE], 'readwrite')
                        .objectStore(IndexedDbLocalStorage.DBTABLE)
                        .delete(key);
        req.onsuccess = () => resolve(null);
        req.onerror = reject;
      } else {
        reject(new Error('Connection closed or not open'));
      }
    }));
  }

  setItem(key: string, data: string): Promise<void> {
    // @ts-ignore
    return new Promise<string|null>(((resolve, reject) => {
      if (this.database) {
        const req = this.database.transaction([IndexedDbLocalStorage.DBTABLE], 'readwrite')
                        .objectStore(IndexedDbLocalStorage.DBTABLE)
                        .put({key: key, value: data});
        req.onsuccess = () => resolve(null);
        req.onerror = reject;
        (<any>req).onblocked = reject;
      } else {
        reject(new Error('Connection closed or not open'));
      }
    }));
  }

  close() {
    this.sessions--;
    if (this.database && this.sessions == 0) {
      this.database.close();
      this.database = null;
    }
  }
}
