import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import faker from 'faker';
import app from '../index';
import userController from '../controllers/user';
import model from '../models/index';

process.env.NODE_ENV = 'test';

const { user: UserModel } = model;

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
  });
});
