import { expect } from '#/helpers/sinon'

import { localForageWrapper } from '@/storages/localForageWrapper'

describe('Storages', function (): void {
  describe('localForageWrapper', function (): void {
    it('Load state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').resolves('A-data')

      const gsw = localForageWrapper(
        'TEST',
        {
          setItem: setItem,
          getItem: getItem
        }
      )

      expect(await gsw.load())
        .to.equal('A-data')
    })

    it('Load empty state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').resolves(null)

      const gsw = localForageWrapper(
        'TEST',
        {
          setItem: setItem,
          getItem: getItem
        }
      )

      expect(await gsw.load())
        .to.equal(null)
    })

    it('Save state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      setItem.withArgs('TEST', 'A-data').resolves(undefined)
      const getItem = this.sinon.stub().throwsArg(0)

      const gsw = localForageWrapper(
        'TEST',
        {
          setItem: setItem,
          getItem: getItem
        }
      )

      return gsw.save('A-data')
    })
  })
})
