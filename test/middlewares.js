import chai from 'chai';
import faker from 'faker';
import usernameGenerator from '../helpers/userHandler';

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
    const userName = faker.internet.userName().toLowerCase();
    const result = uniusername.getUsername(userName);
    result.should.contain(userName);
    done();
  });
});

/**
 * @author jacques nyilinkindi
 * test remove special character from generator class
 */
describe('/ Should remove special character from strings', () => {
  it('it should return a non special character string', (done) => {
    const userName = faker.name.lastName();
    const result = uniusername.removeSpecialCharacters(`@${userName}$`);
    result.should.contain(userName);
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
    const image = 'thisisimage.jpg';
    const result = uniusername.largeTwitterImage(`${image}_normal`);
    result.should.be.eql(image);
    done();
  });
});
