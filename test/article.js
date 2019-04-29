import chai from 'chai';
import faker from 'faker';
import debug from 'debug';
import chaiHttp from 'chai-http';
import db from '../models';
import fakeData from './mockData/articleMockData';
import index from '../index';

const articleModel = db.article;
const userModel = db.user;

chai.should();
chai.use(chaiHttp);

const logError = debug('app:*');

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
let userToken;
describe('Create a user to be used in in creating article', () => {
  it('should create a user', (done) => {
    chai.request(index).post('/api/auth/signup').send(user).then((res) => {
      res.should.have.status(200);
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username');
      userToken = res.body.user.token;
      done();
    })
      .catch(error => logError(error));
  });
});
describe('Create an article', () => {
  it('should create an article', (done) => {
    chai.request(index).post('/api/articles').send(fakeData).set('x-access-token', `${userToken}`)
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
      .catch(error => logError(error));
  });
});
describe('It checks title errors', () => {
  it('Should not create an article if the title is empty', (done) => {
    const newArticle = {
      title: '',
      description: faker.lorem.paragraph(),
      body: faker.lorem.paragraphs(),
      authorid: 100
    };
    chai.request(index).post('/api/articles').set('x-access-token', `${userToken}`).send(newArticle)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('title can not be null');
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Test the body', () => {
  it('should not create and article if the body is empty', (done) => {
    const newArticle = {
      title: faker.random.words(),
      description: faker.lorem.paragraph(),
      body: '',
      authorid: 100
    };
    chai.request(index).post('/api/articles').send(newArticle).set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('The body can\'t be empty');
        done();
      })
      .catch(error => logError(error));
  });
  it('should return an error if the body is not predefined', (done) => {
    const longTitleArticle = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      authorid: 100
    };
    chai.request(index).post('/api/articles').send(longTitleArticle).set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('body can not be null');
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Test the title', () => {
  it('should substring a long title to only 40 characters', (done) => {
    const longTitleArticle = {
      title: faker.lorem.sentences(),
      body: faker.lorem.paragraphs(),
      description: faker.lorem.paragraph(),
      authorid: 100
    };
    chai.request(index).post('/api/articles').send(longTitleArticle).set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('article');
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Test description', () => {
  const newArticle = {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(),
    authorid: 100
  };
  it('should provide a description if not provided', (done) => {
    chai.request(index).post('/api/articles').send(newArticle).then((res) => {
      res.should.have.status(201);
      res.body.should.have.property('article');
      res.body.article.should.have.property('description');
      done();
    })
      .catch(error => error);
  });
});
describe('Test all articles', () => {
  it('should return all the articles', () => {
    chai.request(index).get('/api/articles').then((res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
    })
      .catch((err) => {
        console.log(err);
      });
  });
  it('should return an error message if there is no article', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    chai.request(index).get('/api/articles').then((res) => {
      res.should.have.status(404);
      res.body.should.have.property('error').eql('Not article found for now');
    })
      .catch((err) => {
        console.log(err);
      });
  });
});
