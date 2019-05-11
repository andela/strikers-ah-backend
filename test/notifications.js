import chai from 'chai';
import debug from 'debug';
import dotenv from 'dotenv';
import faker from 'faker';
import models from '../models/index';
import notification from '../controllers/notifications';

const { notifications: notificationModel } = models;

dotenv.config();
process.env.NODE_ENV = 'test';
chai.should();

const logError = debug('app:*');
const users = [
  {
    id: 1,
    firstname: null,
    lastname: null,
    username: 'franklisnsv',
    email: 'harfrank3@gmailv.com',
    inapp_notifications: true,
    email_notifications: true
  }
];
const data = {
  message: faker.lorem.words(),
  username: faker.name.findName(),
  link: faker.internet.url(),
  slug: faker.internet.domainWord()
};
describe('test notification models method', () => {
  it('should be able insert notification', async () => {
    try {
      await notificationModel.newRecord(1, 'article', data.message, data.link);
    } catch (error) {
      logError(error);
    }
  });
});

describe('test notification controller mothods', () => {
  it('should be able insert notifications', async () => {
    try {
      await notification.createArticle(1, data.slug);
    } catch (error) {
      logError(error);
    }
  });
});

describe('test notification controller methods', () => {
  it('should be able send notifications', async () => {
    try {
      await notification.sendNotifications(users, data.username, data.slug);
    } catch (error) {
      logError(error);
    }
  });
});
