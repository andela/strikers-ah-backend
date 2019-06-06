/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import db from '../models';
import index from '../index';


const articleModel = db.article;
const userModel = db.user;
const ratingModel = db.rating;


chai.should();
chai.use(chaiHttp);

/**
 * @author: Clet Mwunguzi
 * @description: tests related to article
 */

const user = {
  username: 'mwunguzi',
  email: 'clet@hjih.com',
  password: '@Cletw1234',
};

const mockUser = {
  username: 'George',
  email: 'username@ui.com',
  password: '@Username19#'
};


let userToken;
let articleSlug;
describe('/Fetching latest articles--> Create a user for rating an article', () => {
  before('Cleaning the database first', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    await userModel.destroy({ truncate: true, cascade: true });
    await ratingModel.destroy({ truncate: true, cascade: true });
  });
  it('should create a user', (done) => {
    chai.request(index).post('/api/auth/signup').send(user).then((res) => {
      userToken = res.body.user.token;
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username').equal('mwunguzi');
      res.body.user.should.have.property('email').equal('clet@hjih.com');
      res.body.user.should.have.property('bio');
      res.body.user.should.have.property('image');
      res.body.user.should.have.property('token');
      done();
    })
      .catch(err => err);
  });

  it('should create a another user', (done) => {
    chai.request(index).post('/api/auth/signup').send(mockUser).then((res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username').equal('George');
      res.body.user.should.have.property('email').equal('username@ui.com');
      res.body.user.should.have.property('bio');
      res.body.user.should.have.property('image');
      res.body.user.should.have.property('token');
      done();
    })
      .catch(err => err);
  });
});

it('should fetch latest articles', (done) => {
  chai.request(index).get('/api/articles/latest')
    .then((res) => {
      res.body.should.be.a('object');
      res.body.should.have.property('status').equal(200);
      res.body.should.have.property('message').equal('There are no latest articles');
      done();
    })
    .catch(err => err);
});

const fakeData = {
  title: faker.random.words(),
  description: faker.lorem.paragraphs(),
  body: faker.lorem.paragraphs()
};
describe('/Fetching latestArticles', () => {
  it('should create an article', (done) => {
    chai.request(index).post('/api/articles')
      .set('Authorization', userToken)
      .send(fakeData)
      .then((res) => {
        articleSlug = res.body.article.slug;
        res.should.have.status(201);
        res.body.should.have.property('article');
        res.body.should.be.a('object');
        res.body.article.should.be.a('object');
        res.body.article.should.have.property('id');
        res.body.article.should.have.property('slug');
        res.body.article.should.have.property('title').equal(fakeData.title);
        res.body.article.should.have.property('description');
        res.body.article.should.have.property('body').equal(fakeData.body);
        res.body.article.should.have.property('author');
        res.body.article.should.have.property('taglist');
        res.body.article.should.have.property('createdAt');
        res.body.article.should.have.property('updatedAt');
        done();
      })
      .catch(err => err);
  });
});

describe('Fetch latest articles in the db', () => {
  it('should fetch latest articles', (done) => {
    chai.request(index).get('/api/articles/latest')
      .send(fakeData)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('data');
        done();
      })
      .catch(err => err);
  });
});
