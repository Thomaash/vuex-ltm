import { GenericStorageWrapper, ToInner, ToOuter } from './GenericStorageWrapper'

/**
 * Required subset of localStorage API by [[localStorageWrapper]].
 *
 * @public
 */
export interface StringStorage {
  getItem(key: string): string | null
  setItem(key: string, data: string): void
}

/**
 * Builds a storage wrapper for storages using the same API as localStorage.
 *
 * @param key - Key used to store the persisted state.
 * @param storage - The storage object (implementing localStorage API).
 * @param toInner - Custom conversion from state object to string (default is JSON.stringify).
 * @param toOuter - Custom conversion from string to state object (default is JSON.parse).
 *
 * @typeparam Outer - The Vuex state type.
 *
 * @public
 */
export function localStorageWrapper<Outer> (
  key: string,
  storage: StringStorage,
  toInner: ToInner<Outer, string> = JSON.stringify.bind(JSON),
  toOuter: ToOuter<Outer, string> = JSON.parse.bind(JSON)
): GenericStorageWrapper<Outer, string> {
  return new GenericStorageWrapper(
    key,
    function setItem (key, data): void {
      storage.setItem(key, data)
    },
    function getItem (key): string | null {
      return storage.getItem(key)
    },
    toInner,
    toOuter
  )
}
