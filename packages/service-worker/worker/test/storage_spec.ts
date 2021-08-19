/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {IndexedDbLocalStorage} from '../src/local-storage';

(function() {
// This tests should only run in browsers
if (typeof (window) !== 'object') {
  return;
}

describe('Local storage', () => {
  describe('IndexedDB storage', () => {
    beforeAll(async () => {
      const db = new IndexedDbLocalStorage();
      await db.clear();
    });

    let database: IndexedDbLocalStorage;
    beforeEach(() => database = new IndexedDbLocalStorage());

    afterEach(async () => {
      database.close();
      await database.clear();
    });

    it('Should manage data properly', async () => {
      await database.open();
      await database.setItem('foo', 'bar');
      const item = await database.getItem('foo');
      expect(item).toBe('bar');
    });

    it('Should create and update data properly', async () => {
      await database.open();
      await database.setItem('foo', 'bar');
      let item = await database.getItem('foo');
      expect(item).toBe('bar');
      await database.setItem('foo', 'bar2');
      item = await database.getItem('foo');
      expect(item).toBe('bar2');
    });

    it('Should not throw exception if data doesn\'t found', async () => {
      await database.open();
      expect(await database.getItem('unknown')).toBeNull();
    });

    it('Should manage multiple connection properly', async (done: DoneFn) => {
      await database.open();
      await database.open();
      await database.setItem('foo', 'bbb');
      let item = await database.getItem('foo');
      expect(item).toBe('bbb');
      database.close();
      let itemAfterClose = await database.getItem('foo');
      expect(itemAfterClose).toBe('bbb');
      database.close();
      try {
        await database.getItem('foo');
        done.fail(new Error('Connection here shouldn\'t be opened'));
      } catch (e) {
        done();
      }
    });

    it('Should close conection properly', (done) => {
      database.open().then(() => {
        database.close();
        database.getItem('unknown').then(() => {
          throw new Error('Connection is not close');
        }, () => done());
      });
    });
  });
});
})();
