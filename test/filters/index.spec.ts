import { expect } from 'chai'

import { Filter, dummyFilter, mutationFilter } from '@/filters/'

const payloads = {
  test: { type: 'test', payload: {} },
  bar: { type: 'bar', payload: {} },
  foo: { type: 'foo', payload: {} },
  fooBar: { type: 'foo/bar', payload: {} },
  fooBer: { type: 'foo/ber', payload: {} },
  fooBor: { type: 'foo/bor', payload: {} },
}

describe('Filters', (): void => {
  describe('dummyFilter', function (): void {
    it('Should return true for everything', (): void => {
      const f: Filter = dummyFilter
      expect(f(payloads.bar))
        .to.be.true
      expect(f(payloads.foo))
        .to.be.true
      expect(f(payloads.fooBar))
        .to.be.true
    })
  })

  describe('mutationFiler', function (): void {
    it('Should return false for everything with empty configuration', (): void => {
      const f: Filter = mutationFilter([])
      expect(f(payloads.bar))
        .to.be.false
      expect(f(payloads.foo))
        .to.be.false
      expect(f(payloads.fooBar))
        .to.be.false
    })

    it('Should return true only for configured mutations (existing mutations)', (): void => {
      const f: Filter = mutationFilter(['foo/bar', 'foo'])
      expect(f(payloads.bar))
        .to.be.false
      expect(f(payloads.foo))
        .to.be.true
      expect(f(payloads.fooBar))
        .to.be.true
    })

    it('Should return true only for configured mutations (existing and nonexisting mutations)', (): void => {
      const f: Filter = mutationFilter(['', 'foo/bar', 'go', 'bar/foo', 'bar'])
      expect(f(payloads.bar))
        .to.be.true
      expect(f(payloads.foo))
        .to.be.false
      expect(f(payloads.fooBar))
        .to.be.true
    })

    it('Should return true only for configured mutations (nonexisting mutations)', (): void => {
      const f: Filter = mutationFilter(['', 'go', 'bar/foo'])
      expect(f(payloads.bar))
        .to.be.false
      expect(f(payloads.foo))
        .to.be.false
      expect(f(payloads.fooBar))
        .to.be.false
    })

    it('Regexps', (): void => {
      const f: Filter = mutationFilter(['', /^foo\//, 'test', /go/, 'bar/foo', /\/bar$/])
      expect(f(payloads.test))
        .to.be.true
      expect(f(payloads.bar))
        .to.be.false
      expect(f(payloads.foo))
        .to.be.false
      expect(f(payloads.fooBor))
        .to.be.true
      expect(f(payloads.fooBer))
        .to.be.true
      expect(f(payloads.fooBar))
        .to.be.true
    })
  })
})
