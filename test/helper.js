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
    const hashNow = helpers.hashPassword(password);
    hashNow.should.be.a('string');
    done();
  });
  it('Should be able to compare password', async () => {
    const verify = helpers.comparePassword(password, hashed);
    verify.should.be.a('boolean').eql(true);
  });
  it('should be able to generate token', (done) => {
    helpers.generateToken(user).should.be.a('string');
    done();
  });
  it('should not hash password if there is an error', () => {
    helpers.hashPassword({}).should.be.a('boolean').eql(false);
  });
  it('should return false if there is a password comparison error', () => {
    helpers.comparePassword({}, 'Hashed').should.be.a('boolean').eql(false);
  });
  it('should return email used if email is found', () => {
    helpers.handleUsed(true, false).should.be.a('string').contains('email');
  });
});
