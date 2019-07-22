import { expect } from '#/helpers/sinon'

import { executeWithDelay, simplyExecute } from '@/executors'

describe('Executors', (): void => {
  describe('simplyExecute', (): void => {
    it('All functions should be executed', function(): void {
      let v = 0

      simplyExecute((): void => {
        v += 2 ** 0
      })
      simplyExecute((): void => {
        v += 2 ** 1
      })
      simplyExecute((): void => {
        v += 2 ** 2
      })
      simplyExecute((): void => {
        v += 2 ** 3
      })
      simplyExecute((): void => {
        v += 2 ** 4
      })

      expect(v).to.equal(2 ** 5 - 1)
    })
  })

  describe('executeWithDelay', (): void => {
    it('Builder function should return a function', async function(): Promise<
      void
    > {
      const execute = executeWithDelay(0)

      expect(execute).to.be.a('function')
    })

    it('Only the last one should be executed', async function(): Promise<void> {
      const execute = executeWithDelay(0)
      let v = 0

      execute((): void => {
        v += 2 ** 0
      })
      execute((): void => {
        v += 2 ** 1
      })
      execute((): void => {
        v += 2 ** 2
      })
      execute((): void => {
        v += 2 ** 3
      })
      execute((): void => {
        v += 2 ** 4
      })

      await new Promise((resolve): void => {
        execute(resolve)
      })

      expect(v).to.equal(0)
    })

    it('Beforeunload event listeners should be set and unset', async function(): Promise<
      void
    > {
      const addSpy = this.sinon.spy(window, 'addEventListener')
      const removeSpy = this.sinon.spy(window, 'removeEventListener')

      function expectSpies(add: number, remove: number): void {
        expect(addSpy.callCount).to.equal(add)
        expect(removeSpy.callCount).to.equal(remove)
      }

      const execute = executeWithDelay(0)

      // Call counts
      expectSpies(0, 0)
      execute((): void => {})
      expectSpies(1, 0)
      execute((): void => {})
      expectSpies(1, 0)
      await new Promise((resolve): void => execute(resolve))
      expectSpies(1, 1)

      // Add event listener call
      const addCall = addSpy.getCall(0)
      expect(addCall.args).to.have.property('0', 'beforeunload')
      expect(addCall.args)
        .to.have.property('1')
        .that.is.a('function')

      const handler: Function = addCall.args[1]

      // Event event listener call
      const removeCall = removeSpy.getCall(0)
      expect(removeCall.args).to.have.property('0', 'beforeunload')
      expect(removeCall.args).to.have.property(
        '1',
        handler,
        'The same function that was added should also be removed.'
      )

      // Handler
      const e = {
        preventDefault: this.sinon.stub(),
        returnValue: null,
      }
      e.preventDefault.onFirstCall().returns(undefined)
      e.preventDefault.throws(
        'Beforeunload hanler shoudn’t call preventDefault multiple times'
      )

      handler(e)

      expect(e.returnValue).to.equal(
        '',
        'Property returnValue should be set to empty string for greater compatibility.'
      )
    })
  })
})
