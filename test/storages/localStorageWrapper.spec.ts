import { expect } from '#/helpers/sinon'

import { localStorageWrapper } from '@/storages/localStorageWrapper'

describe('Storages', function(): void {
  describe('localStorageWrapper', function(): void {
    it('Load state', async function(): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').returns('"A-data"')

      const gsw = localStorageWrapper('TEST', {
        setItem,
        getItem,
      })

      expect(await gsw.load()).to.equal('A-data')
    })

    it('Load empty state', async function(): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').returns(null)

      const gsw = localStorageWrapper('TEST', {
        setItem,
        getItem,
      })

      expect(await gsw.load()).to.equal(null)
    })

    it('Save state', async function(): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      setItem.withArgs('TEST', '"A-data"').returns(undefined)
      const getItem = this.sinon.stub().throwsArg(0)

      const gsw = localStorageWrapper('TEST', {
        setItem,
        getItem,
      })

      return gsw.save('A-data')
    })
  })
})
