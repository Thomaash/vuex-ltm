import { expect } from 'chai'

import { inMemoryStorage } from '@/storages/inMemoryStorage'

interface Data {
  foo: 'A' | 'B'
}

describe('Storages', function(): void {
  describe('inMemoryStorage', function(): void {
    it('Load from empty', async function(): Promise<void> {
      const storage = inMemoryStorage('TEST')

      const loaded = await storage.load()

      expect(loaded).to.be.null
    })

    it('Save and load', async function(): Promise<void> {
      const storage = inMemoryStorage<Data>('TEST')

      const original: Data = { foo: 'A' }
      storage.save(original)
      const loaded = await storage.load()

      expect(loaded).to.equal(original)
      expect(loaded).to.have.property('foo', 'A')
    })

    it('Overwrite', async function(): Promise<void> {
      const storage = inMemoryStorage<Data>('TEST')

      const originalA: Data = { foo: 'A' }
      storage.save(originalA)
      const loadedA = await storage.load()

      expect(loadedA).to.equal(originalA)
      expect(loadedA).to.have.property('foo', 'A')

      const originalB: Data = { foo: 'B' }
      storage.save(originalB)
      const loadedB = await storage.load()

      expect(loadedB).to.equal(originalB)
      expect(loadedB).to.have.property('foo', 'B')

      expect(loadedA).to.not.equal(loadedB)
    })
  })
})
