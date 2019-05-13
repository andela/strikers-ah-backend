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


let userToken, userTokenId;
let articleSlug;
describe('/Fetching ratings --> Create a user for rating an article', () => {
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
      userTokenId = res.body.user.token;
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

const fakeData = {
  title: faker.random.words(),
  description: faker.lorem.paragraphs(),
  body: faker.lorem.paragraphs(),
  authorid: 3
};
describe('/Fetching ratings --> Create an article', () => {
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
        res.body.article.should.have.property('authorid').equal(3);
        res.body.article.should.have.property('taglist');
        res.body.article.should.have.property('createdAt');
        res.body.article.should.have.property('updatedAt');
        done();
      })
      .catch(err => err);
  });
});
describe('Fetch rate for an article', () => {
  it('should not enter an invalid slug', (done) => {
    chai.request(index).get('/api/articles/23/rates')
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
  it('Should verify if article exists', (done) => {
    chai.request(index)
      .get('/api/articles/slug12!/rates')
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error').equal('Article can not be found.');
        done();
      })
      .catch(err => err);
  });
  it('Should verify if there are ratings for an article', (done) => {
    chai.request(index)
      .get(`/api/articles/${articleSlug}/rates`)
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(404);
        res.body.should.have.property('error').equal('No rating found for this article');
        done();
      })
      .catch(err => err);
  });

  it('Should create a new rate for an article', (done) => {
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
        res.body.rated_article.user.should.have.property('username').equal('George');
        res.body.rated_article.should.have.property('article');
        res.body.rated_article.article.should.have.property('title').equal(fakeData.title);
        res.body.rated_article.article.should.have.property('slug').equal(articleSlug);
        res.body.rated_article.should.have.property('rating').equal('Terrible');
        done();
      })
      .catch(err => err);
  });

  it('Should create a new rate for an article', (done) => {
    chai.request(index)
      .post(`/api/articles/${articleSlug}/rate/Good`)
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('rated_article');
        res.body.rated_article.should.be.a('object');
        res.body.rated_article.should.have.property('status').equal(201);
        res.body.rated_article.should.have.property('id');
        res.body.rated_article.should.have.property('user');
        res.body.rated_article.user.should.have.property('username').equal('mwunguzi');
        res.body.rated_article.should.have.property('article');
        res.body.rated_article.article.should.have.property('title').equal(fakeData.title);
        res.body.rated_article.article.should.have.property('slug').equal(articleSlug);
        res.body.rated_article.should.have.property('rating').equal('Good');
        done();
      })
      .catch(err => err);
  });

  it('Should fetch all ratings for an article and users who rated it', (done) => {
    chai.request(index)
      .get(`/api/articles/${articleSlug}/rates`)
      .set('Authorization', userToken)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status').equal(200);
        res.body.article.should.be.a('object');
        res.body.article.should.have.property('title').equal(fakeData.title);
        res.body.article.should.have.property('slug').equal(articleSlug);
        res.body.who_rated.should.be.an('array');
        res.body.who_rated[0].should.contain.keys({
          rating: 1,
          user: { id: mockUser.id, username: mockUser.username }
        });
        res.body.who_rated[1].should.include.keys({
          rating: 4,
          user: { id: user.id, username: user.username }
        });
        res.body.should.have.property('UsersCount').equal(2);

        done();
      })
      .catch(err => err);
  });
});
