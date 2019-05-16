import { GenericStorageWrapper } from './GenericStorageWrapper'

/**
 * Builds storage that keeps the state only in memory (the same way Vuex does).
 *
 * @remarks
 * Useful mainly for testing and development as it doesn't persist anything.
 *
 * @public
 */
export function inMemoryStorage<T> (
  key: string
): GenericStorageWrapper<T, T> {
  const map = new Map<string, T>()

  return new GenericStorageWrapper(
    key,
    function setItem (key, data): void {
      map.set(key, data)
    },
    function getItem (key): T | null {
      const v = map.get(key)
      return v === undefined
        ? null
        : v
    },
    function toInner (outer): T {
      return outer
    },
    function toOuter (inner): T | null {
      return inner
    }
  )
}
