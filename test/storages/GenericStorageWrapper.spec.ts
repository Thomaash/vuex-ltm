import { expect } from '#/helpers/sinon'

import { GenericStorageWrapper } from '@/storages/GenericStorageWrapper'

describe('Storages', function (): void {
  describe('GenericStorageWrapper', function (): void {
    it('Load state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').returns('A-inner')
      const toInner = this.sinon.stub().throwsArg(0)
      const toOuter = this.sinon.stub().throwsArg(0)
      toOuter.withArgs('A-inner').returns('A-outer')

      const gsw = new GenericStorageWrapper(
        'TEST',
        setItem,
        getItem,
        toInner,
        toOuter
      )

      expect(await gsw.load()).to.equal('A-outer')
    })

    it('Load empty state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      const getItem = this.sinon.stub().throwsArg(0)
      getItem.withArgs('TEST').returns(null)
      const toInner = this.sinon.stub().throwsArg(0)
      const toOuter = this.sinon.stub().throwsArg(0)

      const gsw = new GenericStorageWrapper(
        'TEST',
        setItem,
        getItem,
        toInner,
        toOuter
      )

      expect(await gsw.load()).to.equal(null)
    })

    it('Save state', async function (): Promise<void> {
      const setItem = this.sinon.stub().throwsArg(0)
      setItem.withArgs('TEST', 'A-inner').returns(undefined)
      const getItem = this.sinon.stub().throwsArg(0)
      const toInner = this.sinon.stub().throwsArg(0)
      toInner.withArgs('A-outer').returns('A-inner')
      const toOuter = this.sinon.stub().throwsArg(0)

      const gsw = new GenericStorageWrapper(
        'TEST',
        setItem,
        getItem,
        toInner,
        toOuter
      )

      return gsw.save('A-outer')
    })
  })
})
