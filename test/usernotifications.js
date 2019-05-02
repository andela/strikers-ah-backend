import chai from 'chai';
import dotenv from 'dotenv';
import sinon from 'sinon';
import EventEmitter from 'events';
/**
 * @author frank harerimana
 */

dotenv.config();
process.env.NODE_ENV = 'test';

chai.should();

describe('EventEmitter', () => {
  describe('#emit()', () => {
    it('should invoke the callback', () => {
      const spy = sinon.spy();
      const emitter = new EventEmitter();
      emitter.on('verified', spy);
      emitter.emit('verified');
      spy.called.should.be.a('boolean').eql(true);
    });
    it('should pass arguments to the callbacks', () => {
      const spy = sinon.spy();
      const emitter = new EventEmitter();
      emitter.on('verified', spy);
      emitter.emit('verified', 'bar', 'baz');
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, 'bar', 'baz');
    });
  });
});
