import chai from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import db from '../models';
import fakeData from './mockData/articleMockData';
import index from '../index';

const articleModel = db.article;
const userModel = db.user;

chai.should();
chai.use(chaiHttp);

/**
 * @author: Innocent Nkunzi
 * @description: tests related to article
 */

before('Cleaning the database first', async () => {
  await articleModel.destroy({ truncate: true, cascade: true });
  await userModel.destroy({ where: { email: userModel.email }, truncate: true, cascade: true });
});
const user = {
  username: 'nkunziinnocent',
  email: 'nkunzi@gmail.com',
  password: '@Nkunzi1234',
};
let issuedToken;
describe('Create a user to be used in in creating article', () => {
  it('should create a user', (done) => {
    chai.request(index).post('/api/auth/signup').send(user).then((res) => {
      res.should.have.status(200);
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username');
      issuedToken = res.body.user.token;
      done();
    })
      .catch(err => err);
  });
});
describe('Create an article', () => {
  it('should create an article', (done) => {
    chai.request(index).post('/api/articles').set('x-access-token', issuedToken).send(fakeData)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        res.body.article.should.be.a('object');
        res.body.article.should.have.property('id');
        res.body.article.should.have.property('slug');
        res.body.article.should.have.property('title');
        res.body.article.should.have.property('description');
        res.body.article.should.have.property('createdAt');
        res.body.article.should.have.property('updatedAt');
        done();
      })
      .catch(err => err);
  });
});
describe('It checks title errors', () => {
  it('Should not create an article if the title is empty', (done) => {
    const newArticle = {
      title: '',
      description: faker.lorem.paragraph(),
      body: faker.lorem.paragraphs(),
    };
    chai.request(index).post('/api/articles').set('x-access-token', issuedToken).send(newArticle)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('title can not be null');
        done();
      })
      .catch(err => err);
  });
});
describe('Test the body', () => {
  it('should not create and article if the body is empty', (done) => {
    const newArticle = {
      title: faker.random.words(),
      description: faker.lorem.paragraph(),
      body: ''
    };
    chai.request(index).post('/api/articles').set('x-access-token', issuedToken).send(newArticle)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        //   res.body.should.have.property('error').eql('The body can\'t be empty');
        done();
      })
      .catch(err => err);
  });
  it('should return an error if the body is not predefined', (done) => {
    const longTitleArticle = {
      title: faker.lorem.sentences(),
      description: faker.lorem.paragraph(),
    };
    chai.request(index).post('/api/articles').set('x-access-token', issuedToken).send(longTitleArticle)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('article.body cannot be null');
        done();
      })
      .catch(err => err);
  });
});
describe('Test the title', () => {
  it('should substring a long title to only 40 characters', (done) => {
    const longTitleArticle = {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(),
      description: faker.lorem.paragraph(),
    };
    chai.request(index).post('/api/articles').set('x-access-token', issuedToken).send(longTitleArticle)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('article');
        done();
      })
      .catch(err => err);
  });
});

describe('Get users information', () => {
  it('Should get all users', (done) => {
    chai.request(index).get('/api/users').set('x-access-token', issuedToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('profiles').be.a('array');
        res.body.should.have.property('profileCount');
        done();
      })
      .catch(err => err);
  });
  it('Should get user information', (done) => {
    chai.request(index).get(`/api/users/${user.username}`).set('x-access-token', issuedToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('profile').be.a('object');
        done();
      })
      .catch(err => err);
  });
});
