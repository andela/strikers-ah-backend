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

  /**
 * @author frank harerimana
 * @param {*} id
 * @returns {*} reset password success nitification
 */
  static async resetpassword(id) {
    const user = await UserModel.findUser(id);
    Mailer.messageMaker(user.email, 'no-reply Authors haven', 'Your password has been changed successfully', `
    <strong>click the link below to login again<strong> 
    <a href='${process.env.APP_URL}'>Author's haven</a>`);
    return user;
  }
}

export default UserNotification;
