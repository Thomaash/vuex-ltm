import { expect } from '#/helpers/sinon'

import { chromeStorageWrapper } from '@/storages/chromeStorageWrapper'

describe('Storages', function (): void {
  describe('localStorageWrapper', function (): void {
    it('Load state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs(['TEST']).yields({ 'TEST': 'A-data' })

      const gsw = chromeStorageWrapper(
        'TEST',
        {
          set: setItem,
          get: getItem
        }
      )

      expect(await gsw.load())
        .to.equal('A-data')
    })

    it('Load empty state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs(['TEST']).yields({})

      const gsw = chromeStorageWrapper(
        'TEST',
        {
          set: setItem,
          get: getItem
        }
      )

      expect(await gsw.load())
        .to.equal(null)
    })

    it('Save state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      setItem.withArgs({ 'TEST': 'A-data' }).yields(undefined)
      const getItem = this.sinon.stub().throwsArg(0)

      const gsw = chromeStorageWrapper(
        'TEST',
        {
          set: setItem,
          get: getItem
        }
      )

      return gsw.save('A-data')
    })
  })
})
