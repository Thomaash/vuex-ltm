import { expect } from 'chai'

import { pickModules, saveAll } from '@/reducers'

describe('Reducers', function(): void {
  describe('saveAll', function(): void {
    it('Reference', function(): void {
      const state = {}
      expect(saveAll(state)).to.equal(
        state,
        'The value should be simply passed through'
      )
    })

    it('Properties', function(): void {
      const state = {
        foo: 'A',
        arr: ['B'],
        obj: { val: 'C' },
      }

      const reduced = saveAll(state)
      expect(reduced).to.have.property('foo', state.foo)
      expect(reduced).to.have.property('arr', state.arr)
      expect(reduced).to.have.property('obj', state.obj)
    })
  })

  describe('pickModules', function(): void {
    it('Reference', function(): void {
      const state = {}
      expect(pickModules([])(state)).to.not.equal(
        state,
        'The original value should not be modified or returned'
      )
    })

    it('Properties', function(): void {
      const state = {
        foo: 'A',
        arr: ['B'],
        obj: { val: 'C' },
      }

      const a = pickModules([])(state)
      expect(
        a,
        'Everything should be dropped when no modules were defined'
      ).to.be.empty.and.an('object')

      const b = pickModules(['foo', 'arr', 'obj'])(state)
      expect(b).to.have.all.keys(['foo', 'arr', 'obj'])
      expect(b).to.have.property('foo', state.foo)
      expect(b).to.have.property('arr', state.arr)
      expect(b).to.have.property('obj', state.obj)

      const c = pickModules(['arr'])(state)
      expect(c).to.have.all.keys(['arr'])
      expect(c).to.have.property('arr', state.arr)

      const d = pickModules(['non-existent'])(state)
      expect(
        d,
        'Everything should be dropped when only non existent modules were defined'
      ).to.be.empty.and.an('object')
    })
  })
})
