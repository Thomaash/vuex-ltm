import { Data, Storage, key, testAsyncStorage } from '#/helpers/testAsyncStorage'
import { getTestAsyncStorageFunctions } from '#/helpers/chrome'

import { chromeSyncStorage } from '@/storages/chromeSyncStorage'

const storageFunctions = getTestAsyncStorageFunctions<Data>('sync')

describe('Storages', function (): void {
  describe('chromeSyncStorage', function (): void {
    beforeEach(function (): void {
      storageFunctions.mockChromeStorage()
    })

    testAsyncStorage(
      (): Storage => chromeSyncStorage<Data, Data>(key),
      storageFunctions.setState,
      storageFunctions.getState,
      storageFunctions.removeState
    )
  })
})
