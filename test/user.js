import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
<<<<<<< HEAD
=======
import dotenv from 'dotenv';
>>>>>>> ft 164489783 tests for reset password
import faker from 'faker';
import app from '../index';
import userController from '../controllers/user';
import model from '../models/index';

<<<<<<< HEAD
process.env.NODE_ENV = 'test';

const { user: UserModel } = model;
=======
/**
 * @author frank harerimana
 */
const { user: UserModel, resetpassword: resetPassword } = models;

dotenv.config();
process.env.NODE_ENV = 'test';
chai.should();

const logError = debug('app:*');
>>>>>>> ft 164489783 tests for reset password

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
    await UserModel.destroy({ where: { email: user.email } });
  });
<<<<<<< HEAD
  describe('Test User Sign up', () => {
    describe('POST /api/auth/signup', () => {
      it('Should create new User account', (done) => {
        chai.request(app).post('/api/auth/signup').send(user).then((res) => {
          res.should.have.status(200);
          res.body.user.should.be.a('object');
          res.body.user.should.have.property('username').eql('username');
          res.body.user.should.have.property('email').eql('email@tes.com');
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if both email and username are taken', (done) => {
        chai.request(app).post('/api/auth/signup').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });

      it('Should not create user if username is taken', (done) => {
        user.email = 'email@tes1.com';
        chai.request(app).post('/api/auth/signup').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      });
    });
    describe('POST /api/auth/login', () => {
      it('Should be able to login into user account', (done) => {
        user.email = 'email@tes.com';
        user.password = 'P@ssword1';
        chai.request(app).post('/api/auth/login').send(user).then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.should.have.property('token');
          res.body.user.should.have.property('email').eql('email@tes.com');
          done();
        })
          .catch(error => logError(`error${error}`));
      });
    });
    describe('should be able to create a user', () => {
      it('return user object', (done) => {
        const providerList = [
          'facebook',
          'google',
          'twitter',
          'github',
          '',
        ];

        const provider = providerList[Math.floor(Math.random() * providerList.length)];
        const userObj = {
          user: {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            bio: faker.lorem.sentence(),
            image: faker.image.avatar(),
            provider,
            provideruserid: faker.random.number().toString()
          }
        };

        userController.socialLogin(userObj)
          .then(() => {
            UserModel.findAll({
              limit: 1, order: [['createdAt', 'DESC']]
            }).then((res) => {
              res.should.be.a('array');
            });
          });
        done();
      });
    });
=======
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


/**
 * @author frank harerimana
 * defining a faker obj
 */
const ruser = {
  username: faker.name.findName(),
  email: faker.internet.email(),
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  image: faker.image.avatar(),
  provider: faker.name.findName(),
  password: faker.internet.password(),
  provideruserid: `${faker.random.number()}`
};
/**
 * @author frank harerimana
 * testing the user model
 */
describe('/ find or create a user', () => {
  it('it should be able to create a user ', async () => {
    const res = await UserModel.socialUsers(ruser);
    res.should.be.a('object');
  });
});
/**
  * @author frank harerimana
  * checkEmail user model method
  */
describe('/ check user by email', () => {
  it('it should be able find the email ', async () => {
    const result = await UserModel.checkEmail(ruser.email);
    result.should.be.a('object');
    result.dataValues.email.should.contain('@');
  });
});

/**
 * @author frank harerimana
 * update password user model method
 */
describe('/ update password', () => {
  it('it should be able to update password ', async () => {
    const result = await UserModel.resetpassword('P@ssword1', ruser.provideruserid);
    result.should.be.a('array');
  });
});

/**
 * @author frank harerimana
 * testing the reset password model
 */
describe('/ creating a new token record', () => {
  it('it should be able create a resetpassword token', async () => {
    const result = await resetPassword.recordNewReset(ruser.firstname);
    result.dataValues.should.be.a('object');
  });
});

/**
 * @author frank harerimana
 * testing get token user controller
 */
describe('/ checking a token', () => {
  it('it should be able return a token from DB', async () => {
    const result = await resetPassword.checkToken(ruser.firstname);
    result.dataValues.should.be.a('object');
  });
});

/**
 * @author frank harerimana
 * testing forget password user controller
 */
describe('requesting a reset password link', () => {
  it('should be able to return not found email', async () => {
    const result = await chai.request(app)
      .post('/api/v1/login/forgetpassword')
      .send(ruser.email);
    result.should.have.status(404);
    result.should.be.a('object');
  });
});

/**
 * @author frank harerimana
 * testing the invalid token user controller
 */
describe('reset password with bad token', () => {
  it('should return invalid token', async () => {
    const result = await chai.request(app)
      .put('/api/v1/login/resetpassword/eyJhbGciONTU1MDc0ODY0fQ.hDIqzBdYyZ_gzAGVzzKlEu3w7tth0Tp1Vm78Cyp9Av8')
      .send(ruser.password);
    result.should.have.status(400);
>>>>>>> ft 164489783 tests for reset password
  });
});
