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
  username: 'Ryan',
  email: 'ryan1@yui.jk',
  password: 'ryan@S234',
};

const mockUser = {
  username: 'John',
  email: 'johnDoe@hhrr.com',
  password: '@Username19#'
};

const mockUser3 = {
  username: 'Smith',
  email: 'smith4@gmail.com',
  password: '@Smith123E'
};


let userToken, userTokenId, userToken3;
let articleSlug;
describe('/AVG ratings --> Create a user for to fetch avg rating', () => {
  before('Cleaning the database first', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    await userModel.destroy({ truncate: true, cascade: true });
    await ratingModel.destroy({ truncate: true, cascade: true });
  });
  it('should create a user -> AVG', (done) => {
    chai.request(index).post('/api/auth/signup').send(user).then((res) => {
      userToken = res.body.user.token;
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username').equal('Ryan');
      res.body.user.should.have.property('email').equal('ryan1@yui.jk');
      res.body.user.should.have.property('bio');
      res.body.user.should.have.property('image');
      res.body.user.should.have.property('token');
      done();
    })
      .catch(err => err);
  });

  it('should create a another user -> AVG', (done) => {
    chai.request(index).post('/api/auth/signup').send(mockUser).then((res) => {
      userTokenId = res.body.user.token;
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username').equal('John');
      res.body.user.should.have.property('email').equal('johnDoe@hhrr.com');
      res.body.user.should.have.property('bio');
      res.body.user.should.have.property('image');
      res.body.user.should.have.property('token');
      done();
    })
      .catch(err => err);
  });

  it('should create third user -> AVG', (done) => {
    chai.request(index).post('/api/auth/signup').send(mockUser3).then((res) => {
      userToken3 = res.body.user.token;
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username').equal('Smith');
      res.body.user.should.have.property('email').equal('smith4@gmail.com');
      res.body.user.should.have.property('bio');
      res.body.user.should.have.property('image');
      res.body.user.should.have.property('token');
      done();
    })
      .catch(err => err);
  });
});

const fakeData = {
  title: faker.random.words(),
  description: faker.lorem.paragraphs(),
  body: faker.lorem.paragraphs()
};
describe('/AVG ratings --> Create an article', () => {
  it('should create an article -> AVG', (done) => {
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
        res.body.article.should.have.property('authorid');
        res.body.article.should.have.property('taglist');
        res.body.article.should.have.property('createdAt');
        res.body.article.should.have.property('updatedAt');
        done();
      })
      .catch(err => err);
  });
});
describe('Fetch rate for an article --> AVG', () => {
  it('should not enter an invalid slug --> AVG', (done) => {
    chai.request(index).get('/api/articles/23/ratings')
      .set('Authorization', userToken)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(400);
        res.body.should.have.property('error').equal('slug of an article can not be a number.');
        done();
      })
      .catch(err => err);
  });
  it('Should verify if article exists --> AVG', (done) => {
    chai.request(index)
      .get('/api/articles/slugji/ratings')
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error').equal('Article can not be found.');
        done();
      })
      .catch(err => err);
  });
  it('Should verify if there are ratings for an article --> AVG', (done) => {
    chai.request(index)
      .get(`/api/articles/${articleSlug}/ratings`)
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error').equal('No rating. Be first to rate');
        done();
      })
      .catch(err => err);
  });

  it('Should create a new rate for an article -->AVG', (done) => {
    chai.request(index)
      .post(`/api/articles/${articleSlug}/rate/Terrible`)
      .set('Authorization', userTokenId)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('rated_article');
        res.body.rated_article.should.be.a('object');
        res.body.rated_article.should.have.property('status').equal(201);
        res.body.rated_article.should.have.property('id');
        res.body.rated_article.should.have.property('user');
        res.body.rated_article.user.should.have.property('username').equal('John');
        res.body.rated_article.should.have.property('article');
        res.body.rated_article.article.should.have.property('title').equal(fakeData.title);
        res.body.rated_article.article.should.have.property('slug').equal(articleSlug);
        res.body.rated_article.should.have.property('rating').equal('Terrible');
        done();
      })
      .catch(err => err);
  });

  it('Should create a another rate for an article -->AVG', (done) => {
    chai.request(index)
      .post(`/api/articles/${articleSlug}/rate/Good`)
      .set('Authorization', userToken3)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('rated_article');
        res.body.rated_article.should.be.a('object');
        res.body.rated_article.should.have.property('status').equal(201);
        res.body.rated_article.should.have.property('id');
        res.body.rated_article.should.have.property('user');
        res.body.rated_article.user.should.have.property('username').equal('Smith');
        res.body.rated_article.should.have.property('article');
        res.body.rated_article.article.should.have.property('title').equal(fakeData.title);
        res.body.rated_article.article.should.have.property('slug').equal(articleSlug);
        res.body.rated_article.should.have.property('rating').equal('Good');
        done();
      })
      .catch(err => err);
  });

  it('Should fetch average fetch rating of an article -->AVG', (done) => {
    chai.request(index)
      .get(`/api/articles/${articleSlug}/ratings`)
      .set('Authorization', userTokenId)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(200);
        res.body.should.have.property('article');
        res.body.article.should.have.property('title').equal(fakeData.title);
        res.body.article.should.have.property('slug').equal(articleSlug);
        res.body.should.have.property('averageRating').equal('Okay');
        done();
      })
      .catch(err => err);
  });
});
