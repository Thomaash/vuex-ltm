import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
export const expect = chai.expect

beforeEach(function(): void {
  this.sinon = sinon.createSandbox()
})
afterEach(function(): void {
  this.sinon.restore()
})
