import dotenv from 'dotenv';
import Mailer from '../helpers/mailer';
import models from '../models/index';

const { user: UserModel } = models;

dotenv.config();
/**
 * this class distributed the notifications
 */
class UserNotification {
  /**
 * @author frank harerimana
 * @param {*} userid
 * @returns {*} welcome notification
 */
  static async userVerifiedAccount(userid) {
    const user = await UserModel.findUser(userid);
    Mailer.messageMaker(user.email, 'no-reply', 'Thanks for verifying account', `proceed and explore the web 
    <a href='${process.env.APP_URL}'> here </a>`);
    return 'success';
  }
}

export default UserNotification;
