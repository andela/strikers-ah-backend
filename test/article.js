import chai from 'chai';
import faker from 'faker';
import debug from 'debug';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import db from '../models';
import fakeData from './mockData/articleMockData';
import index from '../index';

const articleModel = db.article;
const userModel = db.user;
let slug;
let userId;
const newArticle1 = {
  title: faker.random.words(),
  description: faker.lorem.paragraph(),
  body: ''
};
chai.should();
chai.use(chaiHttp);

const logError = debug('app:*');
dotenv.config();
process.env.NODE_ENV = 'test';
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
  password: '@Nkunzi1234'
};
dotenv.config();
process.env.NODE_ENV = 'test';

describe('Cleaning the database', () => {
  before('Cleaning the database first', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    await userModel.destroy({ where: { email: userModel.email }, truncate: true, cascade: true });
  });
});

// A user to be used to update an article that they didn't create
const newUser = {
  username: 'isharaketis',
  email: 'ishara@gmail.com',
  password: 'Ishara@123'
};
let userToken, testToken;
let categoryId;
let articleSlug;
describe('Create a user to be used in in creating article', () => {
  before('Cleaning the database first', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    await userModel.destroy({ where: { email: userModel.email }, truncate: true, cascade: true });
  });
  it('should create a user', (done) => {
    chai
      .request(index)
      .post('/api/auth/signup')
      .send(user)
      .then((res) => {
        res.should.have.status(200);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('username');
        userToken = res.body.user.token;
        done();
      })
      .catch(error => logError(error));
  });

  it('should create another user to test article ownsershp', () => {
    chai
      .request(index)
      .post('/api/auth/signup')
      .send(newUser)
      .then((res) => {
        res.should.have.status(200);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('username');
        testToken = res.body.user.token;
      })
      .catch(error => logError(error));
  });
});
describe('Create an article', () => {
  it('should create an article', (done) => {
    chai
      .request(index)
      .post('/api/articles')
      .send(fakeData)
      .set('x-access-token', `${userToken}`)
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
      body: faker.lorem.paragraphs()
    };
    chai
      .request(index)
      .post('/api/articles')
      .set('x-access-token', `${userToken}`)
      .send(newArticle)
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
  const newArticle = {
    title: faker.random.words(),
    description: faker.lorem.paragraph(),
    body: ''
  };
  it('should not create and article if the body is empty', (done) => {
    chai
      .request(index)
      .post('/api/articles')
      .send(newArticle)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('body can not be null');
        done();
      })
      .catch(error => logError(error));
  });
  it('should return an error if the body is not predefined', (done) => {
    const longTitleArticle = {
      title: faker.random.words(),
      description: faker.lorem.paragraph()
    };
    chai
      .request(index)
      .post('/api/articles')
      .send(longTitleArticle)
      .set('x-access-token', `${userToken}`)
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
      title:
        'Et optio distinctio dolorem quia reprehenderit qui consequatur illo. Fugit placeat itaque. Temporibus animi quis velit quos ut.',
      body: faker.lorem.paragraphs(),
      description: faker.lorem.paragraph()
    };
    chai
      .request(index)
      .post('/api/articles')
      .send(longTitleArticle)
      .set('x-access-token', `${userToken}`)
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
    body: faker.lorem.paragraphs()
  };
  it('should provide a description if not provided', (done) => {
    chai
      .request(index)
      .post('/api/articles')
      .send(newArticle)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        res.body.article.should.have.property('description');
        articleSlug = res.body.article.slug;
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Pagination tests', () => {
  it('should create an article to be used in pagination test', (done) => {
    chai
      .request(index)
      .post('/api/articles')
      .send(fakeData)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        res.body.article.should.be.a('object');
        done();
      })
      .catch(error => logError(error));
  });
  it('should select apecified article on a given page', (done) => {
    chai
      .request(index)
      .get('/api/articles?page=1&limit=1')
      .then((res) => {
        res.should.have.status(200);
        done();
      })
      .catch(error => logError(error));
  });
  it('should return an error if the page and limit specified are beyond limit', (done) => {
    chai
      .request(index)
      .get('/api/articles?page=9&limit=9')
      .then((res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('No article found for now');
        done();
      })
      .catch(error => logError(error));
  });
});

let newSlug;
describe('Tests for get article', () => {
  const newArticle = {
    title: 'hello world',
    description: faker.lorem.paragraph(),
    body: faker.lorem.paragraphs()
  };
  it('should create an article to be used in get', (done) => {
    chai
      .request(index)
      .post('/api/articles/')
      .set('x-access-token', `${userToken}`)
      .send(newArticle)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        newSlug = res.body.article.slug;
        done();
      })
      .catch(error => logError(error));
  });
  it('should return an article created', (done) => {
    chai
      .request(index)
      .get(`/api/articles/${newSlug}`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('article');
        res.body.article.should.have.property('slug').eql(newSlug);
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Get article errors', () => {
  const invalid = 'jkfaljfalj';
  it('should not return an article if the article slug is not in the database', (done) => {
    chai
      .request(index)
      .get(`/api/articles/${invalid}`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('No article found with the slug provided');
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Delete article', () => {
  let newSlug2;
  const newArticle = {
    title: 'hello world devs',
    description: faker.lorem.paragraph(),
    body: faker.lorem.paragraphs()
  };
  it('should create an article to be deleted', (done) => {
    chai
      .request(index)
      .post('/api/articles/')
      .send(newArticle)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        newSlug2 = res.body.article.slug;
        done();
      })
      .catch(error => logError(error));
  });

  it('should delete an article', (done) => {
    chai
      .request(index)
      .delete(`/api/articles/${newSlug2}`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Article deleted');
        done();
      })
      .catch(error => logError(error));
  });
  it('should not delete an article if it is not existing', (done) => {
    chai
      .request(index)
      .delete(`/api/articles/${newSlug2}`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').eql('No article found for you to delete');
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Test all articles', () => {
  it('should create an article', (done) => {
    chai
      .request(index)
      .post('/api/articles')
      .send(fakeData)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        res.body.article.should.be.a('object');
        done();
      })
      .catch(error => logError(error));
  });
  it('should return all the articles', () => {
    chai
      .request(index)
      .get('/api/articles/all')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
      })
      .catch(error => logError(error));
  });
  it('should return an error message if there is no article', async () => {
    await articleModel.destroy({ truncate: true, cascade: true });
    chai
      .request(index)
      .get('/api/articles/all')
      .then((res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').eql('Not article found for now');
      })
      .catch(error => logError(error));
  });
});
let newSlug3;
describe('Update tests', () => {
  const newArticle = {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs()
  };
  it('should create an article to be updated', (done) => {
    chai
      .request(index)
      .post('/api/articles/')
      .send(newArticle)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('article');
        newSlug3 = res.body.article.slug;
        done();
      })
      .catch(error => logError(error));
  });

  it('should not update an article if a user is not the owner of the article', (done) => {
    chai
      .request(index)
      .put(`/api/articles/${newSlug3}`)
      .send(newArticle)
      .set('x-access-token', `${testToken}`)
      .then((res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('No article found for you to edit');
        done();
      });
  });
  it('should list reporting categories', (done) => {
    chai.request(index).get('/api/articles/report/category').set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('categories');
        res.body.categories.should.be.a('array');
        done();
      })
      .catch(error => logError(error));
  });
  it('should update an article', (done) => {
    chai
      .request(index)
      .put(`/api/articles/${newSlug3}`)
      .send(newArticle)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Article updated');
        newSlug3 = res.body.article.slug;
        done();
      });
  });
});
describe('Test article reporting', () => {
  it('should save reporting category', (done) => {
    const newCategory = {
      category: 'Abuse'
    };
    chai.request(index).post('/api/articles/report/category').send(newCategory).set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('category');
        res.body.category.should.have.property('name');
        categoryId = res.body.category.id;
        done();
      })
      .catch(error => logError(error));
  });

  it('should list reporting categories', (done) => {
    chai.request(index).get('/api/articles/report/category').set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('categories');
        res.body.categories.should.be.a('array');
        done();
      })
      .catch(error => logError(error));
  });
  it('should edit reporting category', (done) => {
    const newCategory = {
      category: 'Abusing'
    };
    chai.request(index).put(`/api/articles/report/category/${categoryId}`).send(newCategory).set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('category');
        res.body.category.should.have.property('name').eql(newCategory.category);
        done();
      })
      .catch(error => logError(error));
  });
});
describe('Bookmark tests', () => {
  it('should bookmark an article', (done) => {
    chai
      .request(index)
      .post(`/api/articles/${newSlug3}/bookmark`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not bookmark an article for the second time', (done) => {
    chai
      .request(index)
      .post(`/api/articles/${newSlug3}/bookmark`)
      .set('x-access-token', `${userToken}`)
      .then((res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        done();
      })
      .catch(error => logError(error));
  });
});

describe('Get users information', () => {
  it('Should get all users', (done) => {
    chai.request(index).get('/api/users').set('x-access-token', userToken)
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
    chai.request(index).get(`/api/users/${user.username}`).set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('profile').be.a('object');
        done();
      })
      .catch(err => err);
  });
  it('Assign user new role', (done) => {
    const newRole = {
      role: 'Moderator'
    };
    chai.request(index).post(`/api/users/${user.username}/role`).set('x-access-token', userToken).send(newRole)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`${user.username}'s role is now ${newRole.role}`);
        done();
      })
      .catch(err => err);
  });

  it('should list all reported articles', (done) => {
    chai.request(index).get('/api/articles/reports').set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('report');
        res.body.report.should.be.a('array');
        done();
      })
      .catch(error => logError(error));
  });

  it('should delete reporting category', (done) => {
    chai.request(index).delete(`/api/articles/report/category/${categoryId}`).set('x-access-token', userToken)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Category deleted');
        done();
      })
      .catch(error => logError(error));
  });
});
