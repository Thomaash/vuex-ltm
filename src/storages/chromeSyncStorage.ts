/* global chrome: false */

import { GenericStorageWrapper, ToInner, ToOuter } from './GenericStorageWrapper'
import { chromeStorageWrapper } from './chromeStorageWrapper'

/**
 * Builds chrome.storage.sync wrapper.
 *
 * @param key - Key used to store the persisted state.
 * @param toInner - Custom conversion from state object to storage object (default is pass through).
 * @param toOuter - Custom conversion from storage object to state object (default is pass through).
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @public
 */
export function chromeSyncStorage<Outer, Inner = Outer> (
  key: string,
  toInner?: ToInner<Outer, Inner>,
  toOuter?: ToOuter<Outer, Inner>
): GenericStorageWrapper<Outer, Inner> {
  return chromeStorageWrapper(
    key,
    chrome.storage.sync,
    toInner,
    toOuter
  )
}
