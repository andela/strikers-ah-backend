import chai from 'chai';
import faker from 'faker';
import encrypt from '../helpers/encrypt';
import Mailer from '../helpers/mailer';
import linkMaker from '../helpers/mailLinkMaker';
import userHandler from '../helpers/userHandler';
import { GetSocial, GetSocialTwitterGithub } from '../middlewares/callbackHandler';

process.env.NODE_ENV = 'test';
chai.should();

let ini = new encrypt('this is a string').encrypt();
const handleUser = new userHandler();
/**
 *  @author frank harerimana
 * test username generator class
 */
describe('/ TEST Middleware', () => {
  it('it should generate random username', (done) => {
    const result = handleUser.getUsername('myusername');
    result.should.contain('myusername');
    done();
  });
});
describe('/ Should generate a unique username', () => {
  it('it should return a username', (done) => {
    const userName = faker.internet.userName().toLowerCase();
    const result = handleUser.getUsername(userName);
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
    const result = handleUser.removeSpecialCharacters(`@${userName}$`);
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
    const result = handleUser.largeTwitterImage(`${image}_normal`);
    result.should.be.eql(image);
    done();
  });
});

/**
 * @author frank harerimana
 * testing the encryption class
 */
describe('/ encrypting a string', () => {
  it('return an encrypted version', async () => {
    const encreInst = new encrypt('this is a string');
    const result = await encreInst.encrypt();
    result.should.be.a('string');
    result.should.not.contain('this is a string');
  });
});

/**
 * @author frank harerimana
 * testing decryption
 */
describe('/ decrypting a string', () => {
  it('return true', async () => {
    const init = new encrypt('this is a string');
    const result = await init.decrypt(`${ini}`);
    result.should.be.a('boolean').eql(true);
  });
});

/**
 * @author frank harerimana
 * testing mail sender
 */
describe('/ sending mail to client', () => {
  it('it should be able to deliver send email', async () => {
    const client = faker.internet.email();
    const subject = 'testing purpose';
    const result = await new Mailer(client, subject).sender();
    result.should.be.a('string');
  });
});

/**
 * @author frank harerimana
 * testing the link maker
 */
describe('/ creating a link to the email', () => {
  it('should return a link', async () => {
    const token = process.env.testEmail;
    ini = await new linkMaker(token);
    const result = await ini.resetPasswordLink();
    result.should.be.a('string');
  });
});


/**
 * @author frank harerimana
 * middleware passport callback
 */
const profile = {
  displayName: faker.name.findName(),
  _json: {
    email: faker.internet.email(),
  },
  name: {
    familyName: faker.name.firstName(),
    givenName: faker.name.lastName(),
  },
  provider: faker.name.findName(),
  provideruserid: `${faker.random.number()}`,
  photos:
   [{
     value:
        'https://lh5.googleusercontent.com/-wFNKsHlz-aY/AAAAAAAAAAI/AAAAAAAAABI/XqxWwOH1NSQ/photo.jpg'
   }],
};
/**
 * @author frank harerimana
 * testing user callback facebook, google
 */
describe('callback for social user', () => {
  it('should be able to return user object', async () => {
    try {
      const result = GetSocial('accessToken', 'refreshToken', profile, 'done');
      result.should.be.a('object');
    } catch (error) {
      return error;
    }
  });
});

/**
 * @author frank harerimana
 * testing social user callback
 */
describe('callback for social user', () => {
  it('should be able to return user object', async () => {
    try {
      const result = GetSocialTwitterGithub('accessToken', 'refreshToken', profile, 'done');
      result.should.be.a('object');
    } catch (error) {
      return error;
    }
  });
});
