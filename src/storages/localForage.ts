import {
  GenericStorageWrapper,
  ToInner,
  ToOuter,
} from './GenericStorageWrapper'
import { LocalForage, localForageWrapper } from './localForageWrapper'
import lf from 'localforage'

export const localForageDrivers = {
  INDEXEDDB: lf.INDEXEDDB,
  LOCALSTORAGE: lf.LOCALSTORAGE,
  WEBSQL: lf.WEBSQL,
}

/**
 * Builds LocalForage wrapper.
 *
 * @param key - Key used to store the persisted state.
 * @param options - Options to be passed to LocalForage.
 * @param toInner - Custom conversion from state object to storage object (default is pass through).
 * @param toOuter - Custom conversion from storage object to state object (default is pass through).
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @public
 */
export function localForage<Outer, Inner = Outer>(
  key: string,
  options: Parameters<typeof lf.createInstance>[0] = {},
  toInner?: ToInner<Outer, Inner>,
  toOuter?: ToOuter<Outer, Inner>
): GenericStorageWrapper<Outer, Inner> {
  return localForageWrapper(
    key,
    lf.createInstance(options) as LocalForage<Inner>,
    toInner,
    toOuter
  )
}
