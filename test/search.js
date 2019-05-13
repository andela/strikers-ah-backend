import chai from 'chai';
import debug from 'debug';
import chaiHttp from 'chai-http';
import index from '../index';
import fakeData from './mockData/articleMockData';
import db from '../models';

const userModel = db.user;
chai.should();
chai.use(chaiHttp);

const logError = debug('app:*');

const user = {
  username: 'Orlando',
  email: 'orland@yahoo.com',
  password: 'Orland@123',
};
let userToken;
describe('Create a user to be used in in creating article', () => {
  before('Cleaning the database first', async () => {
    await userModel.destroy({ truncate: true, cascade: true });
  });
  it('should create a user', (done) => {
    chai.request(index).post('/api/auth/signup').send(user).then((res) => {
      res.should.have.status(200);
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username');
      userToken = res.body.user.token;
      done();
    })
      .catch(err => err);
  });
});

describe('Tests for search', () => {
  it('should create an article to search for', (done) => {
    chai.request(index).post('/api/articles').send(fakeData).set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        done();
      })
      .catch(err => logError(err));
  });
  it('should search in the database', (done) => {
    chai.request(index).get(`/api/search?keyword=${fakeData.title}`).then((res) => {
      res.should.have.status(200);
      done();
    })
      .catch(err => logError(err));
  });
});
