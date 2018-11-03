/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {async_it} from './async';
import {SwPush} from '../src/push';
import {NgswCommChannel} from '../src/low_level';
import {MockServiceWorkerContainer} from '../testing/mock';

(function () {
  // These tests only works properly on browsers
  if (typeof(atob) !== 'function') {
    return;
  }

  describe('Service worker push', () => {
    let mock: MockServiceWorkerContainer;
    let comm: NgswCommChannel;
    let push: SwPush;
    beforeEach(() => {
      mock = new MockServiceWorkerContainer();
      comm = new NgswCommChannel(mock as any, 'browser');
      push = new SwPush(comm);
      mock.setupSw();
    });

    async_it('save subscription on local storage', async() => {
        spyOn(comm, 'postMessageWithStatus');
        await push.requestSubscription({serverPublicKey: 'foo'});
        expect(comm.postMessageWithStatus).toHaveBeenCalled();
    });
  });
}());

