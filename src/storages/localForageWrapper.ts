import { GenericStorageWrapper, ToInner, ToOuter } from './GenericStorageWrapper'

export interface LocalForage<T> {
  getItem(key: string): Promise<T>
  setItem(key: string, data: T): Promise<void>
}

/**
 * Builds a storage wrapper for storages using the same API as LocalForage.
 *
 * @param key - Key used to store the persisted state.
 * @param storage - The storage object (implementing LocalForage API).
 * @param toInner - Custom conversion from state object to storage object (default is pass through).
 * @param toOuter - Custom conversion from storage object to state object (default is pass through).
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @public
 */
export function localForageWrapper<Outer, Inner = Outer> (
  key: string,
  storage: LocalForage<Inner>,
  toInner: ToInner<Outer, Inner> = (data): Inner => data as unknown as Inner,
  toOuter: ToOuter<Outer, Inner> = (data): Outer | null => data as unknown as Outer | null
): GenericStorageWrapper<Outer, Inner> {
  return new GenericStorageWrapper(
    key,
    function setItem (key, data): Promise<void> {
      return storage.setItem(key, data)
    },
    function getItem (key): Promise<Inner | null> {
      return storage.getItem(key)
    },
    toInner,
    toOuter
  )
}
