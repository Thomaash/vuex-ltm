import deepmerge, { Options } from 'deepmerge'

/**
 * Merges state loaded from the storage with the one present in Vuex.
 *
 * @param loaded - State just loaded from the storage.
 * @param previous - State present in Vuex (probably defaults).
 *
 * @returns State that will be put into Vuex.
 *
 * @public
 */
export type Merger<S> = (loaded: Partial<S>, previous: S) => S

/**
 * Discard the previous state and use the loaded one.
 *
 * @param loaded - State just loaded from the storage.
 * @param previous - State present in Vuex (probably defaults).
 *
 * @returns State that will be put into Vuex.
 *
 * @public
 */
export function replace<S> (loaded: Partial<S>, previous: S): S
export function replace<S> (loaded: Partial<S>): S
export function replace<S> (loaded: Partial<S>): S {
  return loaded as S
}

/**
 * Replace each property of Vuex state with loaded one.
 *
 * @param loaded - State just loaded from the storage.
 * @param previous - State present in Vuex (probably defaults).
 *
 * @returns State that will be put into Vuex.
 *
 * @public
 */
export function shallowMerge<S> (loaded: Partial<S>, previous: S): S {
  return {
    ...previous,
    ...loaded
  }
}

/**
 * Deep merge the states using [[deepmerge]] library (defaults except that arrays are replaced).
 *
 * @param loaded - State just loaded from the storage.
 * @param previous - State present in Vuex (probably defaults).
 *
 * @returns State that will be put into Vuex.
 *
 * @remarks
 * See [[configurableDeepMerge]] for customizations.
 *
 * @public
 */
export function deepMerge<S> (loaded: Partial<S>, previous: S): S {
  return deepmerge(previous, loaded, {
    // Replace arrays instead of concatenating them
    arrayMerge: (_destinationArray, sourceArray): any[] => sourceArray
  })
}

/**
 * Builds merger that deep merges the states using [[deepmerge]] library with custom options.
 *
 * @param options - Options to be passed to the library.
 *
 * @returns Merger that can be passed to [[LTM]].
 *
 * @public
 */
export function configurableDeepMerge<S> (options: Options): Merger<S> {
  return function innerDeepMerge<S> (loaded: Partial<S>, previous: S): S {
    return deepmerge(previous, loaded, options)
  }
}
