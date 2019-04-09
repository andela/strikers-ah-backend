import chaiHttp from 'chai-http';
import assert, { AssertionError } from 'assert';
import chai from 'chai';
import models from '../models/index';

const User = models.user;
// const logError = debug('app:*');

chai.use(chaiHttp);
chai.should();
const user = {
  username: 'username',
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  password: 'password'
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
});
