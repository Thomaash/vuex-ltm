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
export function dummyFilter(): boolean {
  return true
}

/**
 * Builds a filter that filters mutations by given types.
 *
 * @param mutations - Mutation types that should trigger persisting.
 *
 * @public
 */
export function mutationFilter(mutations: (string | RegExp)[]): Filter {
  const values = mutations.filter(
    (value): value is string => typeof value === 'string'
  )
  const regexps = mutations.filter(
    (value): value is RegExp => value instanceof RegExp
  )
  return function ({ type }: MutationPayload): boolean {
    return (
      values.indexOf(type) >= 0 || regexps.some((re): boolean => re.test(type))
    )
  }
}
