/**
 * Removes parts of the state that shouldn't be persisted.
 *
 * @param state - The full state from Vuex.
 * @returns The part of the state that should be persisted.
 *
 * @public
 */
export type Reducer<S> = (state: S) => Partial<S>

/**
 * Saves the entire state.
 *
 * @public
 */
export function saveAll<S>(state: S): S {
  return state
}

/**
 * Saves only select modules.
 *
 * @param moduleNames - Names (as they appear in state object) of modules to be persisted.
 *
 * @public
 */
export function pickModules<S>(moduleNames: string[]): Reducer<S> {
  return function (state: S): Partial<S> {
    const reduced: Partial<S> = {}
    moduleNames.forEach((name): void => {
      if (Object.prototype.hasOwnProperty.call(state, name)) {
        ;(reduced as any)[name] = (state as any)[name]
      }
    })
    return reduced
  }
}
