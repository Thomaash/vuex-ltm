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
 * @public
 */
export function localStorageWrapper<T> (
  key: string,
  storage: StringStorage,
  toInner: ToInner<T, string> = JSON.stringify.bind(JSON),
  toOuter: ToOuter<T, string> = JSON.parse.bind(JSON)
): GenericStorageWrapper<T, string> {
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
