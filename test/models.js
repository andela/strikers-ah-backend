import chaiHttp from 'chai-http';
import assert, { AssertionError } from 'assert';
import chai from 'chai';
import faker from 'faker';
import models from '../models/index';
import modelsuserverification from '../models/userverification';

const { user: User, userverification } = models;

chai.use(chaiHttp);
chai.should();
const user = {
  username: 'username',
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  password: 'password'
};
const verification = {
  userid: faker.random.number(),
  hash: faker.random.uuid(),
  status: 'Pending',
};
describe('TEST MODELS', () => {
  describe('TEST USER MODEL', () => {
    it('Should throw an error on an invalid email', async () => {
      try {
        await User.create(user);
        assert.fail('expected exception not thrown');
      } catch (error) {
        if (error instanceof AssertionError) {
          throw error;
        }
        assert.equal(error.name, 'SequelizeValidationError');
      }
    });
  });
  describe('TEST  VERIFICAION MODEL', () => {
    it('Should save new verification', async () => {
      const verify = await userverification.create(verification);
      verify.should.be.a('object');
      verify.should.have.property('userid').eql(verification.userid);
      verify.should.have.property('hash').eql(verification.hash);
      verify.should.have.property('status').eql(verification.status);
    });
  });
  describe('TEST  VERIFICAION MODEL CREATE', () => {
    it('Should be a function', async () => {
      modelsuserverification.should.be.a('function');
    });
  });
});
