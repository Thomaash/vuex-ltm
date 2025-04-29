import { expect, use } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

use(sinonChai)
export { expect }

beforeEach(function (): void {
  this.sinon = sinon.createSandbox()
})
afterEach(function (): void {
  this.sinon.restore()
})
