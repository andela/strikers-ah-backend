/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import helpers from '../helpers/helper';
import longText from './mockData/tesDumyData';

chai.use(chaiHttp);
chai.should();
const article = {
  id: 1,
  slug: 'hello-article-title-a380db2',
  taglist: [],
  title: 'hello article title',
  body: `Carmen Casco de Lara Castro (17 June 1918 – 8 May 1993) was a Paraguayan teacher, women's and human rights advocate and a politician. She established one of the first independent human rights organizations in Latin America and fought for both women's equality and an end to state sponsored terroris...,
  description: Carmen Casco de Lara Castro (17 June 1918 – 8 May 1993) was a Paraguayan teacher, women's and human ...`,
  authorid: 1,
  createdAt: '2019-04-24T09:46:22.945Z',
  updatedAt: '2019-04-24T09:46:22.945Z'
};
describe('Test helpers', () => {
  const password = 'PassWord@1!';
  const user = { username: 'Floribert', email: 'Mwibutsa' };
  const hashed = helpers.hashPassword(password);

  it('Should be able to hash password', done => {
    const hashNow = helpers.hashPassword(password);
    hashNow.should.be.a('string');
    done();
  });
  it('Should be able to compare password', async () => {
    const verify = helpers.comparePassword(password, hashed);
    verify.should.be.a('boolean').eql(true);
  });
  it('should be able to generate token', done => {
    helpers.generateToken(user).should.be.a('string');
    done();
  });
  it('should not hash password if there is an error', () => {
    helpers
      .hashPassword({})
      .should.be.a('boolean')
      .eql(false);
  });
  it('should return false if there is a password comparison error', () => {
    helpers
      .comparePassword({}, 'Hashed')
      .should.be.a('boolean')
      .eql(false);
  });
  it('should return email used if email is found', () => {
    helpers
      .handleUsed(true, false)
      .should.be.a('string')
      .contains('email');
  });
  it('should be able to detect the time it takes to read an article', () => {
    helpers.articleReadTime(longText.longText).should.eql(1);
  });

  it('should be able to combine any number of objects', () => {
    const result = helpers.combineWithArticle(article, {
      likes: 1,
      dislikes: 0,
      readTimeMinutes: 1
    });
    result.should.have.property('likes');
    result.should.have.property('slug');
  });
  it('should be able to return a combination of the two objects', () => {
    const result = helpers.combineHelper({ attr1: '1' }, { attr2: '2' });
    result.should.have.property('attr2');
    result.should.have.property('attr1');
  });

  it('async handle should be able to catch errors', done => {
    const customFunction = helpers.asyncHandler(async (req, res, next) => {
      throw new Error('custom error');
    });
    const req = {};
    const res = {
      status(stat) {
        return {
          json(obj) {
            try {
              const error = new Error(`${obj}${stat}`);
              throw error;
            } catch (err) {
              err.name = 'SequelizeValidationError';
            }
          }
        };
      }
    };
    try {
      customFunction(req, res);
    } catch (error) {
      error.status = 500;
    }
    done();
  });
  it('should not allow password without at least one small case character', () => {
    const message = helpers.validatePassword('@1PASSWORD');
    message.should.be
      .a('string')
      .eql('The password must contain at least one lower case character');
  });
  it('should not allow password withless than 8 characters', () => {
    const message = helpers.validatePassword('@1Pass');
    message.should.be
      .a('string')
      .eql('password must not be less than 8 characters');
  });
});
