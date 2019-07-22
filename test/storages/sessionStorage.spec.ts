import {
  Data,
  Storage,
  key,
  testAsyncStorage,
} from '#/helpers/testAsyncStorage'
import { getTestAsyncStorageFunctions } from '#/helpers/localStorage'

import { sessionStorage } from '@/storages/sessionStorage'

const storageFunctions = getTestAsyncStorageFunctions<Data>('sessionStorage')

describe('Storages', function(): void {
  describe('sessionStorage', function(): void {
    testAsyncStorage(
      (): Storage => sessionStorage<Data>(key),
      storageFunctions.setState,
      storageFunctions.getState,
      storageFunctions.removeState
    )
  })
})
