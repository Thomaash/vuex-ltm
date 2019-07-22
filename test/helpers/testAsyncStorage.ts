import { expect } from '#/helpers/sinon'
import { getNewVuex } from '#/helpers/vuex'

import { AsyncStorage } from '@/storages'
import { simplyExecute } from '@/executors'
import { dummyFilter } from '@/filters'
import { replace } from '@/mergers'
import { saveAll } from '@/reducers'

import { LTM } from '@/LTM'

export * from '#/helpers/sinon'

export const key = 'STANDARD-ASYNC-STORAGE-TEST'

export type Storage = AsyncStorage<Data>

export interface Data {
  foo?: string
  bar?: string
}

const ltmDefaults = {
  execute: simplyExecute,
  filter: dummyFilter,
  merge: replace,
  reduce: saveAll,
}

const data = {
  blank: (): Data => ({}),
  a: (): Data => ({
    foo: 'A',
  }),
  b: (): Data => ({
    bar: 'B',
  }),
}

export function testAsyncStorage(
  getNewStorage: () => Storage,
  setState: (key: string, state: Data) => void | Promise<void>,
  getState: (key: string) => Data | null | Promise<Data | null>,
  delState: (key: string) => void | Promise<void>
): void {
  describe('Standard async storage test', function(): void {
    it('Load state (blank → A)', async function(): Promise<void> {
      await setState(key, data.a())

      const ltm = new LTM<Data>({
        ...ltmDefaults,
        storage: getNewStorage(),
      })

      const store = getNewVuex<Data>({
        state: data.blank(),
        plugins: [ltm.plugin],
      })

      expect(store.state).to.eql(
        data.blank(),
        'The store’s state should be blank right after it’s creation.'
      )

      await ltm.ready

      expect(store.state).to.eql(
        data.a(),
        'The A state should’ve been loaded by this time.'
      )
    })

    it('Load state (A → B)', async function(): Promise<void> {
      await setState(key, data.b())

      const ltm = new LTM<Data>({
        ...ltmDefaults,
        storage: getNewStorage(),
      })

      const store = getNewVuex<Data>({
        state: data.a(),
        plugins: [ltm.plugin],
      })

      expect(store.state).to.eql(
        data.a(),
        'The store’s state should be A right after it’s creation.'
      )

      await ltm.ready

      expect(store.state).to.eql(
        data.b(),
        'The B state should’ve been loaded by this time.'
      )
    })

    it('Load state (A → null)', async function(): Promise<void> {
      await delState(key)

      const ltm = new LTM<Data>({
        ...ltmDefaults,
        storage: getNewStorage(),
      })

      const store = getNewVuex<Data>({
        state: data.a(),
        plugins: [ltm.plugin],
      })

      expect(store.state).to.eql(
        data.a(),
        'The store’s state should be A right after it’s creation.'
      )

      await ltm.ready

      expect(store.state).to.eql(
        data.a(),
        'The store’s state should be unchanged.'
      )
    })

    it('Save state after mutation', async function(): Promise<void> {
      await delState(key)

      const ltm = new LTM<Data>({
        ...ltmDefaults,
        storage: getNewStorage(),
      })

      const store = getNewVuex<Data>({
        state: data.blank(),
        plugins: [ltm.plugin],
        mutations: {
          setBar(state, v: string): void {
            state.bar = v
          },
        },
      })

      await ltm.ready

      store.commit('setBar', data.b().bar)

      await new Promise((resolve): void => void setTimeout(resolve, 0))

      expect(await getState(key)).to.eql(
        data.b(),
        'The store’s state should’ve been persisted by now.'
      )
    })
  })
}
