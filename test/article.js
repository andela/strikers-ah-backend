import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models';
import index from '../index';

const articleModel = db.article;

chai.should();
chai.use(chaiHttp);

before('Cleaning the database first', (done) => {
  articleModel.destroy({ truncate: true, cascade: true });
  done();
});
describe('Create an article', () => {
  it('It should create an article', (done) => {
    const newArticle = {
      title: 'how to train your dragon',
      description: 'Article about dragon Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    };
    chai.request(index).post('/api/article').send(newArticle).then((res) => {
      res.should.have.status(201);
      res.body.should.have.property('article');
      res.body.article.should.be.a('object');
      res.body.article.should.have.property('id');
      res.body.article.should.have.property('slug');
      res.body.article.should.have.property('title').eql('how to train your dragon');
      res.body.article.should.have.property('description').eql('Article about dragon Lorem Ipsum is simply dummy text of the printing and typesetting industry');
      res.body.article.should.have.property('createdAt');
      res.body.article.should.have.property('updatedAt');
      done();
    })
      .catch((err) => {
        console.log(err);
      });
  });
});
describe('It checks input errors', () => {
  it('Should not create an article if the title is empty', (done) => {
    const newArticle = {
      title: '',
      description: 'Article about dragon',
      body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    };
    chai.request(index).post('/api/article').send(newArticle).then((res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error').eql('"title" is not allowed to be empty');
      done();
    })
      .then((err) => {
        console.log(err);
      });
  });
  it('should not create and article if the body is empty', (done) => {
    const newArticle = {
      title: 'Article about dragon',
      description: 'Article about dragon',
      body: '',
    };
    chai.request(index).post('/api/article').send(newArticle).then((res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error').eql('"body" is not allowed to be empty');
      done();
    });
  });
  it('should not create an article if the description value is null', (done) => {
    const newArticle = {
      title: 'Article about dragon',
      body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    };
    chai.request(index).post('/api/article').send(newArticle).then((res) => {
      // console.log(res.body.errors[0].message);
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('name').eql('SequelizeValidationError');
      res.body.errors.should.be.a('array');
      res.body.errors[0].should.have.property('message').eql('article.description cannot be null');
      done();
    })
      .catch((error) => {
        console.log(error);
      });
  });
});
