import {
  Data,
  Storage,
  key,
  testAsyncStorage,
} from '#/helpers/testAsyncStorage'
import { getTestAsyncStorageFunctions } from '#/helpers/localStorage'

import { localStorage } from '@/storages/localStorage'

const storageFunctions = getTestAsyncStorageFunctions<Data>('localStorage')

describe('Storages', function(): void {
  describe('localStorage', function(): void {
    testAsyncStorage(
      (): Storage => localStorage<Data>(key),
      storageFunctions.setState,
      storageFunctions.getState,
      storageFunctions.removeState
    )
  })
})
