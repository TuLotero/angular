/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/// <reference lib="webworker" />

export declare global {
  interface ServiceWorkerGlobalScope {
    /**
     * Disallow accessing `CacheStorage APIs directly to ensure that all
     * accesses go through a
     * `NamedCacheStorage` instance (exposed by the `Adapter`).
     */
    caches: unknown;
  }
}

// Push API
interface PushSubscriptionChangeEvent extends ExtendableEvent {
  readonly newSubscription?: PushSubscription;
  readonly oldSubscription?: PushSubscription;
}

// Sync API
interface SyncEvent extends ExtendableEvent {
  lastChance: boolean;
  tag: string;
}
