import { expect } from 'chai'

import {
  configurableDeepMerge,
  deepMerge,
  replace,
  shallowMerge,
} from '@/mergers'

interface State {
  foo?: 'loaded' | 'previous'
  bar?: 'loaded' | 'previous'
  array?: number[]
  object?: {
    foo?: 'loaded' | 'previous'
    bar?: 'loaded' | 'previous'
  }
}

function getLoaded(): State {
  return {
    foo: 'loaded',
    array: [7],
    object: {
      foo: 'loaded',
    },
  }
}
function getPrevious(): State {
  return {
    foo: 'previous',
    bar: 'previous',
    array: [0, 1, 2],
    object: {
      foo: 'previous',
      bar: 'previous',
    },
  }
}

describe('Mergers', (): void => {
  describe('replace', (): void => {
    it('Should return it’s first argument.', (): void => {
      const loaded = {}
      const previous = {}

      expect(replace(loaded, previous)).to.equal(loaded)
    })
  })

  describe('shallowMerge', (): void => {
    it('Should return a new object.', (): void => {
      const loaded = {}
      const previous = {}

      expect(shallowMerge(loaded, previous))
        .to.not.equal(loaded)
        .and.to.not.equal(previous)
    })

    it('Should overwrite previous properties with loaded.', (): void => {
      const loaded = getLoaded()
      const previous = getPrevious()

      expect(shallowMerge(loaded, previous)).to.eql({
        foo: 'loaded',
        bar: 'previous',
        array: [7],
        object: {
          foo: 'loaded',
        },
      })
    })
  })

  describe('deepMerge', (): void => {
    it('Should return a new object.', (): void => {
      const loaded = {}
      const previous = {}

      expect(deepMerge(loaded, previous))
        .to.not.equal(loaded)
        .and.to.not.equal(previous)
    })

    it('Should overwrite previous properties with loaded even in nested objects but not arrays.', (): void => {
      const loaded = getLoaded()
      const previous = getPrevious()

      expect(deepMerge(loaded, previous)).to.eql({
        foo: 'loaded',
        bar: 'previous',
        array: [7],
        object: {
          foo: 'loaded',
          bar: 'previous',
        },
      })
    })
  })

  describe('configurableDeepMerge', (): void => {
    it('Should return a new object.', (): void => {
      const loaded = {}
      const previous = {}

      expect(configurableDeepMerge({})(loaded, previous))
        .to.not.equal(loaded)
        .and.to.not.equal(previous)
    })

    it('Should overwrite previous properties with loaded even in nested objects and arrays.', (): void => {
      const loaded = getLoaded()
      const previous = getPrevious()

      expect(configurableDeepMerge({})(loaded, previous)).to.eql({
        foo: 'loaded',
        bar: 'previous',
        array: [0, 1, 2, 7],
        object: {
          foo: 'loaded',
          bar: 'previous',
        },
      })
    })
  })
})
