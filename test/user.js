import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import app from '../index';
import models from '../models/index';

const User = models.user;

const logError = debug('app:*');

chai.use(chaiHttp);
chai.should();

const user = {
  username: 'username',
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email@tes.com',
  password: 'P@ssword1'
};
describe('Test User', () => {
  before(async () => {
    // clear data in the table
    await User.destroy({ where: { email: user.email } });
  });
  describe('Test User Sign up', () => {
    describe('POST /api/users', () => {
      it('Should create new User account', (done) => {
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(201);
          res.body.user.should.be.a('object');
          res.body.user.should.have.property('username').eql('username');
          res.body.user.should.have.property('email').eql('email@tes.com');
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if both email and username are taken', (done) => {
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if username is taken', (done) => {
        user.email = 'email@tes1.com';
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });
    });
  });
  describe('Test User  Login', () => {
    describe('POST /users/login', () => {
      it('Should be able to login into user account', (done) => {
        user.email = 'email@tes.com';
        chai.request(app).post('/api/users/login').send({ email: user.email, password: user.password }).then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('token');
          res.body.user.should.have.property('email').eql('email@tes.com');
          done();
        })
          .catch(error => logError(error));
      });
    });
  });
});
