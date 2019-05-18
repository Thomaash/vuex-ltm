import { GenericStorageWrapper } from './GenericStorageWrapper'

/**
 * Builds storage that keeps the state only in memory (the same way Vuex does).
 *
 * @remarks
 * Useful mainly for testing and development as it doesn't persist anything.
 *
 * @typeparam Outer - The Vuex state type.
 *
 * @public
 */
export function inMemoryStorage<Outer> (
  key: string
): GenericStorageWrapper<Outer> {
  const map = new Map<string, Outer>()

  return new GenericStorageWrapper(
    key,
    function setItem (key, data): void {
      map.set(key, data)
    },
    function getItem (key): Outer | null {
      const v = map.get(key)
      return v === undefined
        ? null
        : v
    },
    function toInner (outer): Outer {
      return outer
    },
    function toOuter (inner): Outer | null {
      return inner
    }
  )
}
