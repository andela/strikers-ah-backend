import chai from 'chai';
import client from '../config/redisConfig';

chai.should();

describe('Test Redis connection', () => {
  it('Client should be an array', (done) => {
    client.should.be.an('object');
    done();
  });
});
