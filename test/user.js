import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import dotenv from 'dotenv';
import faker from 'faker';
import app from '../index';
import helper from '../helpers/helper';
import userController from '../controllers/user';
import models from '../models/index';
import usernotifications from '../controllers/userNotification';
import userEvents from '../helpers/userEvents';

/**
 * @author frank harerimana
 */
const {
  user: UserModel, resetpassword: resetPassword, following: followingModel,
  followers: followersModel
} = models;

dotenv.config();
process.env.NODE_ENV = 'test';

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
    // await UserModel.destroy({ where: { email: user.email } });
  });
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
      }).timeout(15000);

      it('Should not create user if both email and username are taken', (done) => {
        chai.request(app).post('/api/auth/signup').send(user).then((res) => {
          res.should.have.status(400);
          res.should.have.property('error');
          done();
        })
          .catch(error => logError(error));
      }).timeout(15000);

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

        describe('reset password success notification', () => {
          it('should send notification', async () => {
            try {
              const res = await usernotifications.resetpassword(user.id);
              res.should.be.a('object');
              res.should.have.property('username');
            } catch (error) {
              logError(error);
            }
          });
        });

        describe('reset password helper notification', () => {
          it('should pass data to notification controller', async () => {
            try {
              const userEvent = new userEvents();
              const res = await userEvent.resetpassword(user.id);
              res.should.be.a('number').eql(user.id);
            } catch (error) {
              logError(error);
            }
          });
        });


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
    describe('GET /api/auth/verify/:hash', () => {
      it('Should be able to verify account signed up', (done) => {
        const hash = faker.random.uuid();
        chai.request(app).get(`/api/auth/verify/${hash}`).then((res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Verification token not found');
          done();
        })
          .catch(error => logError(`error${error}`));
      });
    });
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
  it('it should be able to create a user ', (done) => {
    UserModel.socialUsers(ruser)
      .then((result) => {
        result.should.be.a('object');
        done();
      });
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
    try {
      const result = await UserModel.resetpassword('P@ssword1', ruser.provideruserid);
      result.should.be.a('array');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * @author frank harerimana
 * testing the reset password model
 */
describe('/ creating a new token record', () => {
  it('it should be able create a resetpassword token', async () => {
    try {
      const result = await resetPassword.recordNewReset(ruser.firstname);
      result.dataValues.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * @author frank harerimana
 * testing get token user controller
 */
describe('/ checking a token', () => {
  it('it should be able return a token from DB', async () => {
    try {
      const result = await resetPassword.checkToken(ruser.firstname);
      result.dataValues.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * @author frank harerimana
 * testing forget password user controller
 */
describe('requesting a reset password link', () => {
  it('should be able to return not found email', async () => {
    try {
      const result = await chai.request(app)
        .post('/api/v1/login/forgetpassword')
        .send(user.email);
      result.should.have.status(404);
      result.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * @author frank harerimana
 * testing forget password user controller
 */
describe('requesting a reset password link', () => {
  it('should be able to return not found email', async () => {
    try {
      const result = await chai.request(app)
        .post('/api/v1/login/forgetpassword')
        .send(ruser.email);
      result.should.have.status(404);
      result.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('reset password with an unexisting email', () => {
  it('it should return error', (done) => {
    chai.request(app).post('/api/auth/forgetpassword').send(`${faker.internet.email}`)
      .then((result) => {
        result.should.have.status(404);
        done();
      })
      .catch(error => logError(error));
  });
});
<<<<<<< HEAD

describe('reset password with an existing email', () => {
  it('it should return error', (done) => {
    chai.request(app).post('/api/auth/forgetpassword').send({ email: ruser.email })
      .then((result) => {
        result.should.have.status(202);
        done();
      })
      .catch(error => logError(error));
  });
});

/**
 * @author frank harerimana
 */
describe('record a new user follow', () => {
  it('it should return a new record', (done) => {
    followingModel.newRecord(1, 1).then((result) => {
      result.should.be.a('object');
      done();
    })
      .catch(error => logError(error));
  });
});
describe('find user by id', () => {
  it('it should be able return a user', async () => {
    try {
      const result = await UserModel.checkUser(user.username);
      result.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('create follow record', () => {
  it('should be able return the record', async () => {
    try {
      const result = await followingModel.newRecord(1, 1);
      result.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * check following status following model method
 */
describe('find follow record', () => {
  it('should be able return the record', async () => {
    try {
      const result = await followingModel.findRecord(1, 1);
      result.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

const newtoken = helper.generateToken(user);
describe('follow the user who does not exist', () => {
  it('should return bad request', async () => {
    try {
      const res = await chai.request(app).post('/api/profiles/mimi/follow').set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(400);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('user should not follow himself', () => {
  it('should return conflict', async () => {
    try {
      const res = await chai.request(app).post(`/api/profiles/${user.username}/follow`).set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(409);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('user should follow another', () => {
  it('should follow other', async () => {
    try {
      const res = await chai.request(app).post(`/api/profiles/${ruser.username}/follow`).set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(201);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * follow user following model
 */
describe('follow user', () => {
  it('it should be able follow user', async () => {
    try {
      await followersModel.newRecord(1, 1);
    } catch (error) {
      logError(error);
    }
  });
});

describe('user should unfollow another', () => {
  it('should unfollow other', async () => {
    try {
      const res = await chai.request(app).delete(`/api/profiles/${ruser.username}/follow`).set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(201);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('user should not unfollow himself', () => {
  it('should return conflict', async () => {
    try {
      const res = await chai.request(app).delete(`/api/profiles/${user.username}/follow`).set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(409);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('unfollow the user who does not exist', () => {
  it('should return bad request', async () => {
    try {
      const res = await chai.request(app).delete('/api/profiles/joromi/follow').set('Authorization', `Bearer ${newtoken}`);
      res.should.have.status(400);
      res.should.be.a('object');
    } catch (error) {
      logError(error);
    }
  });
});

describe('follow user with no authentication', () => {
  it('should return authentication requires', (done) => {
    chai.request(app).delete('/api/profiles/joromi/follow')
      .then((res) => {
        res.should.have.status(401);
        done();
      })
      .catch(error => logError(error));
  });
});

describe('follow user with invalid token', () => {
  it('should return invalid token', (done) => {
    chai.request(app).delete('/api/profiles/joromi/follow').set('Authorization', `Bearer makeitInvalid${newtoken}`)
      .then((res) => {
        res.should.have.status(401);
        done();
      })
      .catch(error => logError(error));
  });
});

/**
 * delete followers model
 */
describe('delete follower record', () => {
  it('it should be able delete follow record', async () => {
    try {
      await followersModel.unfollow(1, 1);
    } catch (error) {
      logError(error);
    }
  });
});

/**
 * delete following model
 */
describe('delete follower record', () => {
  it('it should be able delete follow record', async () => {
    try {
      await followingModel.unfollow(1, 1);
    } catch (error) {
      logError(error);
    }
  });
});
=======
>>>>>>> Feature(article): Get article
