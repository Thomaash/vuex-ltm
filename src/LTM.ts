import { MutationPayload, Plugin, Store } from 'vuex'

import { AsyncStorage } from './storages'
import { Executor } from './executors'
import { Filter } from './filters'
import { Merger } from './mergers'
import { Reducer } from './reducers'

export interface LTMConfig<S> {
  execute: Executor
  filter: Filter
  merge: Merger<S>
  reduce: Reducer<S>
  storage: AsyncStorage<Partial<S>>
}

/**
 * Long Term Memory main class.
 *
 * @typeparam S - Vuex state type.
 *
 * @public
 */
export class LTM<S> {
  private readonly execute: Executor
  private readonly filter: Filter
  private readonly merge: Merger<S>
  private readonly reduce: Reducer<S>
  private readonly storage: AsyncStorage<Partial<S>>

  /**
   * Resolves when the state has been restored or no persisted state was found.
   */
  public readonly ready: Promise<void>
  private resolveReady: () => void = (): void => {}
  private rejectReady: () => void = (): void => {}

  /**
   * @param execute - [[Executor]] that controls when and if the state will be persisted (e.g. to prevent bursts).
   * @param filter - [[Filter]] that decides whether a mutation will trigger persisting.
   * @param merge - [[Merger]] that merges loaded state into Vuex.
   * @param reduce - [[Reducer]] that picks which parts of the state will be persisted.
   * @param storage - [[AsyncStorage]] that saves state data to the store.
   */
  public constructor({
    execute,
    filter,
    merge,
    reduce,
    storage,
  }: LTMConfig<S>) {
    this.execute = execute
    this.filter = filter
    this.merge = merge
    this.reduce = reduce
    this.storage = storage

    this.ready = new Promise((resolve, reject): void => {
      this.resolveReady = resolve
      this.rejectReady = reject
    })
  }

  private async save(mutation: MutationPayload, state: S): Promise<void> {
    if (!(await this.filter(mutation))) {
      return
    }

    const partialState = await this.reduce(state)

    if (!partialState) {
      return
    }

    this.execute((): void => {
      this.storage.save(partialState)
    })
  }

  private async load(store: Store<S>): Promise<void> {
    const loaded = await this.storage.load()

    if (!loaded) {
      return this.resolveReady()
    }

    const merged = await this.merge(loaded, store.state)

    store.replaceState(merged)

    this.resolveReady()
  }

  /**
   * Vuex plugin (i.e. new Vuex.Store({ plugins: [ltm.plugin]})).
   */
  public get plugin(): Plugin<S> {
    return (store: Store<S>): void => {
      store.subscribe((mutation, state): void => {
        this.save(mutation, state)
      })

      this.load(store)
    }
  }
}
