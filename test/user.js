import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import User from '../models/user';

chai.use(chaiHttp);
chai.should();

describe('Test User Signup', () => {
  let user;
  let token;
  before((done) => {
    chai.request(app);
    // clear data in the table
    User.sync({ force: true });
    done();
  });
  describe('POST /api/users', () => {
    before((done) => {
      user = {
        username: 'username',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@tes.com'
      };
      done();
    });
    it('Should create new User account', (done) => {
      chai.request(app).post('/api/users').send(user).then((res) => {
        res.should.have.status(201);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('firstname').eql('firstname');
        res.body.user.should.have.property('lastname').eql('lastname');
        res.body.user.should.have.property('username').eql('firstname');
        res.body.user.should.have.property('email').eql('email@tes.com');
      })
        .catch(error => error);
      done();
    });

    it('Should not create user if both email and username are already taken', (done) => {
      chai.request(app).post('/api/users').send(user).then((res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').contains('email');
        res.body.should.have.property('error').contains('username');
      })
        .catch(error => error);
      done();
    });

    it('Should not create user if email is taken', (done) => {
      user = {
        username: 'username1',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@tes.com'
      };
      chai.request(app).post('/api/users').send(user).then((res) => {
        res.should.have.status(400);
        res.should.have.property('error').contains('email');
      })
        .catch(error => error);
      done();
    });

    it('Should not create user if username is taken', (done) => {
      user = {
        username: 'username',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email1@tes.com'
      };
      chai.request(app).post('/api/users').send(user).then((res) => {
        res.should.have.status(400);
        res.should.have.property('error').contains('username');
      })
        .catch(error => error);
      done();
    });
  });
  it('Should not create user with missing fields', (done) => {
    chai.request(app).post('/api/users').send({ username: 'username', password: 'password@1' }).then((res) => {
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.be.a('object');
    })
      .catch(error => error);
    done();
  });
  it('should return a token on successful registration', (done) => {
    chai.request(app).post('/api/users').send(user).then((res) => {
      res.body.should.have.property('token');
    })
      .catch(error => error);
    done();
  });
});
