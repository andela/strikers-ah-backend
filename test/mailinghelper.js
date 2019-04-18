import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { hashEmail, getVerificationEmail, sendAccountVerification } from '../helpers/mailing';

chai.use(chaiHttp);
chai.should();

describe('Test Mailing helper', () => {
  it('Should be able to hash email', (done) => {
    const hash = hashEmail(faker.internet.email());
    hash.should.be.a('string');
    done();
  });
  it('Should be able to get a verification email', (done) => {
    const email = getVerificationEmail(faker.internet.email(), faker.random.uuid());
    email.should.be.a('string');
    done();
  });
  it('Should be able to send email verification', (done) => {
    const email = faker.internet.email();
    const sendemail = sendAccountVerification(email, faker.name.findName());
    sendemail.should.be.a('string').eql(hashEmail(email));
    done();
  });
});
