import { GenericStorageWrapper, ToInner, ToOuter } from './GenericStorageWrapper'
import { localStorageWrapper } from './localStorageWrapper'

/**
 * Builds localStorage wrapper.
 *
 * @param key - Key used to store the persisted state.
 * @param toInner - Custom conversion from state object to string (default is JSON.stringify).
 * @param toOuter - Custom conversion from string to state object (default is JSON.parse).
 *
 * @typeparam Outer - The Vuex state type.
 *
 * @public
 */
export function localStorage<Outer> (
  key: string,
  toInner?: ToInner<Outer, string>,
  toOuter?: ToOuter<Outer, string>
): GenericStorageWrapper<Outer, string> {
  return localStorageWrapper(
    key,
    window.localStorage,
    toInner,
    toOuter
  )
}
