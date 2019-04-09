import chai from 'chai';
import usernameGenerator from '../middlewares/uniquestring';

process.env.NODE_ENV = 'test';
chai.should();

const uniusername = new usernameGenerator();
/**
 *  @author frank harerimana
 * test username generator class
 */
describe('/ TEST Middleware', () => {
  it('it should generate random username', (done) => {
    const result = uniusername.getUsername('myusername');
    result.should.contain('myusername');
    done();
  });
});
describe('/ Should generate a unique username', () => {
  it('it should return a username', (done) => {
    const result = uniusername.getUsername('myusername');
    result.should.contain('myusername');
    done();
  });
});

/**
 * @author jacques nyilinkindi
 * test remove special character from generator class
 */
describe('/ Should remove special character from strings', () => {
  it('it should return a non special character string', (done) => {
    const result = uniusername.removeSpecialCharacters('@myusername$');
    result.should.contain('myusername');
    result.should.not.contain('@');
    result.should.not.contain('$');
    done();
  });
});

/**
 * @author jacques nyilinkindi
 * test remove special character from generator class
 */
describe('/ Should make twitter image large', () => {
  it('it should remove _normal from the image URL', (done) => {
    const result = uniusername.generateLargeTwitterProfile('_normalthisisimage.jpg');
    result.should.be.eql('thisisimage.jpg');
    done();
  });
});
