import chai from 'chai';
import chaiHttp from 'chai-http';
import helpers from '../helpers/helper';

chai.use(chaiHttp);
chai.should();

describe('Test helpers', () => {
  const password = 'PassWord@1!';
  const user = { username: 'Floribert', email: 'Mwibutsa' };
  const hashed = helpers.hashPassword(password);

  it('Should be able to hash password', (done) => {
    helpers.hashPassword(password).then((res) => {
      res.should.be.a('string');
    }).catch(error => error);
    done();
  });
  it('Should be able to compare password', (done) => {
    helpers.comparePassword(password, hashed).then((res) => {
      res.should.be.a('boolean');
    }).catch(error => error);
    done();
  });
  it('should be able to generate token', (done) => {
    helpers.generateToken(user).should.be.a('string');
    done();
  });
});
