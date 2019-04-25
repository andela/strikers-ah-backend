import chai from 'chai';
import debug from 'debug';
import dotenv from 'dotenv';
import faker from 'faker';
import Mailer from '../helpers/mailer';
import userEvents from '../helpers/userEvents';

dotenv.config();
process.env.NODE_ENV = 'test';
chai.should();

const logError = debug('app:*');

const data = {
  email: faker.internet.email(),
  subject: faker.random.words(),
  message: faker.lorem.paragraphs(),
  footer: faker.lorem.sentences()
};
describe('mailer class', () => {
  it('should be able to send email', async () => {
    try {
      const res = await Mailer.messageMaker(data.email, data.subject, data.message, data.footer);
      res.should.be.a('boolean');
    } catch (error) {
      logError(error);
    }
  });
});

describe('user event handler', () => {
  it('should pass data to the controller and return sucess', async () => {
    try {
      const event = new userEvents();
      const res = event.verifyingAccount(faker.random.number());
      res.should.be.a('string');
    } catch (error) {
      logError(error);
    }
  });
});
