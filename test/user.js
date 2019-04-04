import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import app from '../index';
import User from '../models/user';

const logError = debug('app:*');

chai.use(chaiHttp);
chai.should();
let createdAccount;
describe('Test User', () => {
  before(async () => {
    chai.request(app);
    await User.sync({ force: true });
    // clear data in the table
    await User.destroy({ where: {}, truncate: true });
  });
  describe('Test User Sign up', () => {
    describe('POST /api/users', () => {
      let user;
      it('Should create new User account', (done) => {
        user = {
          username: 'username',
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'email@tes.com',
          password: 'P@ssword1'
        };
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(201);
          res.body.user.should.be.a('object');
          res.body.user.should.have.property('username').eql('username');
          res.body.user.should.have.property('email').eql('email@tes.com');
          createdAccount = res.body.user;
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if email is taken', (done) => {
        user = {
          username: 'username',
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'email@tes.com',
          password: 'P@ssword1'
        };
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if username is taken', (done) => {
        user = {
          username: 'username',
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'email@tes1.com',
          password: 'P@ssword1'
        };
        chai.request(app).post('/api/users').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });
    });
    it('Should not create user with missing fields', (done) => {
      chai.request(app).post('/api/users').send({ username: 'username', password: 'password@1' }).then((res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.be.a('array');
        done();
      })
        .catch(error => logError(error));
    });
    it('should return a token on successful registration', (done) => {
      const user = {
        username: 'exampleusername',
        firstname: 'examplefirstname',
        lastname: 'examplelastname',
        email: 'exampleemail@tes.com',
        password: 'exampleP@ssword'
      };
      chai.request(app).post('/api/users').send(user).then((res) => {
        res.body.should.have.property('token');
        done();
      })
        .catch(error => logError(error));
    });
  });
  describe('Test User  Login', () => {
    describe('POST /users/login', () => {
      it('Should be able to login into user account', (done) => {
        chai.request(app).post('/api/users/login').send({ email: createdAccount.email, password: 'P@ssword1' }).then((res) => {
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
