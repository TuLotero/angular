/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @experimental
 */
export type Glob = string;

/**
 * @experimental
 */
export type Duration = string;

/**
 * A top-level Angular Service Worker configuration object.
 *
 * @experimental
 */
export interface Config {
  appData?: {};
  index: string;
  push?: PushConfig;
  assetGroups?: AssetGroup[];
  dataGroups?: DataGroup[];
}

/**
 * Configuration for handling push subscription changes.
 *
 * @experimental
 */
export interface PushConfig {
  url: string;
  headers: string[][];
  authReader: PushAuthReader;
}

/**
 *  Configuration for reading server authentication.
 *
 *  @experimental
 */
export interface PushAuthReader {
  type: string;
  config: object;
}


/**
 *  Configuration for reading server authentication from local storage.
 *
 *  @experimental
 */
export interface IndexedDbPushAuthReader extends PushAuthReader {
  type: 'indexedDb';
  config: {
    db: string;
    table: string;
    id: string;
  }
}


/**
 * Configuration for a particular group of assets.
 *
 * @experimental
 */
export interface AssetGroup {
  name: string;
  installMode?: 'prefetch'|'lazy';
  updateMode?: 'prefetch'|'lazy';
  resources: {files?: Glob[]; versionedFiles?: Glob[]; urls?: Glob[];};
}

/**
 * Configuration for a particular group of dynamic URLs.
 *
 * @experimental
 */
export interface DataGroup {
  name: string;
  urls: Glob[];
  version?: number;
  cacheConfig: {
    maxSize: number; maxAge: Duration; timeout?: Duration; strategy?: 'freshness' | 'performance';
  };
}
