import chai from 'chai';
import usernameGenerator from '../middlewares/uniquestring';

process.env.NODE_ENV = 'test';
chai.should();

/**
 * test username generator class
 */
describe('/ GET all meetups', () => {
  it('it should generate random username', (done) => {
    const strings = new usernameGenerator('myusername');
    const result = strings.getUsername();
    result.should.contain('myusername');
    done();
  });
});
