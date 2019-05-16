import { MutationPayload } from 'vuex'

/**
 * Decides if given mutation should trigger persisting.
 *
 * @param mutation - The mutation from Vuex.
 * @returns True to persist, false to ignore.
 *
 * @public
 */
export type Filter = (mutation: MutationPayload) => boolean

/**
 * Persists everything
 *
 * @returns Always true.
 *
 * @public
 */
export function dummyFilter (): boolean {
  return true
}

/**
 * Builds a filter that filters mutations by given types.
 *
 * @param mutations - Mutation types that should trigger persisting.
 *
 * @public
 */
export function mutationFilter (mutations: string[]): Filter {
  return function (mutation: MutationPayload): boolean {
    return mutations.indexOf(mutation.type) >= 0
  }
}
