import chaiHttp from 'chai-http';
import assert, { AssertionError } from 'assert';
import chai from 'chai';
import faker from 'faker';
import debug from 'debug';
import models from '../models/index';
import modelsuserverification from '../models/userverification';

const logError = debug('app:*');

const { user: User, userverification, ArticleLikesAndDislikes } = models;

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
  describe('TEST ARTICLE LIKES AND DISLIKES MODEL', () => {
    it('should create empty object to show that current user has not liked', (done) => {
      ArticleLikesAndDislikes.saveLike({ user_id: '100', article_id: '1' }, 'like')
        .then((res) => {
          res.should.be.a('object');
          done();
        }).catch(err => logError(err));
    });
    it('it should change existing like to a dislike', (done) => {
      ArticleLikesAndDislikes.saveLike({ user_id: '100', article_id: '1' }, 'dislike')
        .then((res) => {
          res.should.be.a('object');
          done();
        }).catch(err => logError(err));
    });
    it('should delete existing like if it is similar to the incoming like', (done) => {
      ArticleLikesAndDislikes.saveLike({ user_id: '100', article_id: '1' }, 'dislike')
        .then((res) => {
          res.should.be.eql(1);
          done();
        }).catch(err => logError(err));
    });
  });
});
