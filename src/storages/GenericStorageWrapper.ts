/**
 * Storage interface that can be passed to [[LTM]].
 *
 * @typeparam T - The storage state type.
 *
 * @remarks
 * Valid storage can also be built using [[GenericStorageWrapper]].
 */
export interface AsyncStorage<T> {
  save(obj: T): Promise<void>
  load(): Promise<T | null>
}

/**
 * Handles state persisting.
 *
 * @param key - String identifying persisted state (like in localStorage.setItem(key, …)).
 * @param data - The state to be persisted.
 *
 * @typeparam T - The storage state type.
 *
 * @returns Shouldn't return or resolve returned promise before the state is persisted.
 *
 * @public
 */
export type SetItem<T> =
  | ((key: string, data: T) => Promise<void>)
  | ((key: string, data: T) => void)

/**
 * Handles persisted state loading.
 *
 * @param key - String identifying persisted state (like in localStorage.getItem(key)).
 *
 * @typeparam T - The storage state type.
 *
 * @returns The persisted state or null if no state exists in the storage. May return a promise resolving to the forementioned value.
 *
 * @public
 */
export type GetItem<T> =
  | ((key: string) => Promise<T | null>)
  | ((key: string) => T | null)

/**
 * Converts outer state (used in Vuex) to inner state (persisted), e.g. JSON.stringify(…).
 *
 * @param data - The state data in outer format.
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @returns The state data in inner format.
 *
 * @public
 */
export type ToInner<Outer, Inner> = (data: Outer) => Inner

/**
 * Converts inner state (persisted) to outer state (used in Vuex), e.g. JSON.parse(…).
 *
 * @param data - The state data in inner format.
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 *
 * @returns The state data in outer format.
 *
 * @public
 */
export type ToOuter<Outer, Inner> = (data: Inner) => Outer | null

/**
 * Builds a custom storage that can be passed to [[LTM]].
 *
 * @typeparam Outer - The Vuex state type.
 * @typeparam Inner - The storage state type.
 */
export class GenericStorageWrapper<Outer, Inner = Outer>
  implements AsyncStorage<Outer> {
  private key: string
  private setItem: SetItem<Inner>
  private getItem: GetItem<Inner>
  private toInner: ToInner<Outer, Inner>
  private toOuter: ToOuter<Outer, Inner>

  public constructor(
    key: string,
    setItem: SetItem<Inner>,
    getItem: GetItem<Inner>,
    toInner: ToInner<Outer, Inner>,
    toOuter: ToOuter<Outer, Inner>
  ) {
    this.key = key
    this.setItem = setItem
    this.getItem = getItem
    this.toInner = toInner
    this.toOuter = toOuter
  }

  public async save(outer: Outer): Promise<void> {
    const inner = this.toInner(outer)
    this.setItem(this.key, inner)
  }

  public async load(): Promise<Outer | null> {
    const inner = await this.getItem(this.key)
    if (inner) {
      return this.toOuter(inner)
    } else {
      return null
    }
  }
}
