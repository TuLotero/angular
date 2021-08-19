/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgswCommChannel} from '../src/low_level';
import {SwPush} from '../src/push';
import {MockServiceWorkerContainer} from '../testing/mock';

(function() {
// These tests only works properly on browsers
if (typeof (atob) !== 'function') {
  return;
}

describe('Service worker push', () => {
  let mock: MockServiceWorkerContainer;
  let comm: NgswCommChannel;
  let push: SwPush;
  beforeEach(() => {
    mock = new MockServiceWorkerContainer();
    comm = new NgswCommChannel(mock as any);
    push = new SwPush(comm);
    mock.setupSw();
  });

  it('save subscription on local storage', async () => {
    spyOn(comm, 'postMessageWithStatus');
    await push.requestSubscription({serverPublicKey: 'foo'});
    expect(comm.postMessageWithStatus).toHaveBeenCalled();
  });
});
}());
