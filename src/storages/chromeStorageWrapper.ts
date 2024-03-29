import {
  GenericStorageWrapper,
  ToInner,
  ToOuter,
} from './GenericStorageWrapper'

export interface StorageItems<T> {
  [key: string]: T
}
export interface ChromeStorage<T> {
  get(key: string[], callback: (result: StorageItems<T>) => void): void
  set(data: StorageItems<T>, callback: () => void): void
}

/**
 * Builds a storage wrapper for storages using the same API as chrome.storage.*.
 *
 * @param key - Key used to store the persisted state.
 * @param storage - The storage object (implementing chrome.storage.* API).
 * @param toInner - Custom conversion from state object to storage object (default is pass through).
 * @param toOuter - Custom conversion from storage object to state object (default is pass through).
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @public
 */
export function chromeStorageWrapper<Outer, Inner = Outer>(
  key: string,
  storage: ChromeStorage<Inner>,
  toInner: ToInner<Outer, Inner> = (data: Outer): Inner =>
    data as unknown as Inner,
  toOuter: ToOuter<Outer, Inner> = (data: Inner): Outer | null =>
    data as unknown as Outer | null
): GenericStorageWrapper<Outer, Inner> {
  return new GenericStorageWrapper(
    key,
    function setItem(key, data): Promise<void> {
      return new Promise((resolve): void => {
        storage.set({ [key]: data }, resolve)
      })
    },
    function getItem(key): Promise<Inner | null> {
      return new Promise((resolve): void => {
        storage.get([key], (result): void => {
          resolve(result[key])
        })
      })
    },
    toInner,
    toOuter
  )
}
