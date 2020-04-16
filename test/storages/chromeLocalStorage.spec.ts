import {
  Data,
  Storage,
  key,
  testAsyncStorage,
} from '#/helpers/testAsyncStorage'
import { getTestAsyncStorageFunctions } from '#/helpers/chrome'

import { chromeLocalStorage } from '@/storages/chromeLocalStorage'

const storageFunctions = getTestAsyncStorageFunctions<Data>('local')

describe('Storages', function (): void {
  describe('chromeLocalStorage', function (): void {
    beforeEach(function (): void {
      storageFunctions.mockChromeStorage()
    })

    testAsyncStorage(
      (): Storage => chromeLocalStorage<Data, Data>(key),
      storageFunctions.setState,
      storageFunctions.getState,
      storageFunctions.removeState
    )
  })
})
