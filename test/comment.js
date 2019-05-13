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
 * @author: Jacques Nyilinkindi
 * @description: tests related to article's comment
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
let tokenIssued;
let articleSlug;
let commentId;
describe('Article commenting', () => {
  it('should create a user to be used in commenting an article', (done) => {
    chai.request(index).post('/api/auth/login').send(user).then((res) => {
      res.should.have.status(200);
      res.body.user.should.be.a('object');
      res.body.user.should.have.property('username');
      tokenIssued = res.body.user.token;
      done();
    })
      .catch(err => err);
  });

  it('should create an article', (done) => {
    chai.request(index).post('/api/articles').set('x-access-token', tokenIssued).send(fakeData)
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
        articleSlug = res.body.article.slug;
        done();
      })
      .catch(err => err);
  });

  it('Should creare a comment on article', (done) => {
    const newComment = {
      comment: {
        body: faker.lorem.sentence()
      }
    };
    chai.request(index).post(`/api/articles/${articleSlug}/comments`).set('x-access-token', tokenIssued).send(newComment)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        res.body.comment.should.be.a('object');
        res.body.comment.should.have.property('id');
        res.body.comment.should.have.property('comment').eql(newComment.comment.body);
        res.body.comment.should.have.property('createdAt');
        res.body.comment.should.have.property('updatedAt');
        res.body.comment.should.have.property('author');
        res.body.comment.author.should.be.a('object');
        commentId = res.body.comment.id;
        done();
      })
      .catch(err => err);
  });

  it('Should update a comment on article', (done) => {
    const newComment = {
      comment: {
        body: faker.lorem.sentence()
      }
    };
    chai.request(index).put(`/api/articles/${articleSlug}/comments/${commentId}`).set('x-access-token', tokenIssued).send(newComment)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        res.body.comment.should.be.a('object');
        res.body.comment.should.have.property('id');
        res.body.comment.should.have.property('comment').eql(newComment.comment.body);
        res.body.comment.should.have.property('createdAt');
        res.body.comment.should.have.property('updatedAt');
        res.body.comment.should.have.property('author');
        res.body.comment.author.should.be.a('object');
        done();
      })
      .catch(err => err);
  });

  it('Should get all comments on article', (done) => {
    chai.request(index).get(`/api/articles/${articleSlug}/comments`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        res.body.comment.should.be.a('array');
        res.body.should.have.property('commentsCount');
        done();
      })
      .catch(err => err);
  });

  it('Like a comment', (done) => {
    chai.request(index).post(`/api/articles/${articleSlug}/comments/${commentId}/like`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.a('string').eql('Comment liked');
        done();
      })
      .catch(err => err);
  });

  it('Should get comments on article sorted by popularity', (done) => {
    chai.request(index).get(`/api/articles/${articleSlug}/comments/popular`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      })
      .catch(err => err);
  });

  it('Unlike a comment', (done) => {
    chai.request(index).post(`/api/articles/${articleSlug}/comments/${commentId}/like`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.a('string').eql('Comment unliked');
        done();
      })
      .catch(err => err);
  });

  it('Should get edit history of comments on article', (done) => {
    chai.request(index).get(`/api/articles/${articleSlug}/comments/${commentId}/history`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('commenthistory');
        res.body.commenthistory.should.be.a('array');
        res.body.should.have.property('count');
        done();
      })
      .catch(err => err);
  });

  it('Should delete a comment on article', (done) => {
    chai.request(index).delete(`/api/articles/${articleSlug}/comments/${commentId}`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Comment deleted');
        done();
      })
      .catch(err => err);
  });
  it('Should get all articles', (done) => {
    chai.request(index).get('/api/articles/all').set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      })
      .catch(err => err);
  });

  it('Should read article', (done) => {
    chai.request(index).get(`/api/articles/${articleSlug}`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      })
      .catch(err => err);
  });

  it('Should get user reading history', (done) => {
    chai.request(index).get(`/api/users/${user.username}/stats`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('stats');
        res.body.should.have.property('statsCount');
        done();
      })
      .catch(err => err);
  });

  it('Should get article readers', (done) => {
    chai.request(index).get(`/api/articles/${articleSlug}/stats`).set('x-access-token', tokenIssued)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('stats');
        res.body.should.have.property('statsCount');
        done();
      })
      .catch(err => err);
  });
});
