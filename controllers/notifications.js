import dotenv from 'dotenv';
import Mailer from '../helpers/mailer';
import models from '../models/index';
import mailLinkMaker from '../helpers/mailLinkMaker';

const { user: UserModel, followers: followersModel, notifications: notificationModel } = models;

dotenv.config();
/**
 * this class distributed the notifications
 */
class Notifications {
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

  /**
   * @author frank harerimana
   * @param {*} id
   * @returns {*} user
   */
  static async user(id) {
    const res = await UserModel.findUser(id);
    return res;
  }

  /**
   * @author frank harerimana
   * @param {*} id
   * @param {*} message
   * @param {*} link
   * @returns {*} user
   */
  static async NewNotification(id, message, link) {
    const res = await notificationModel.newRecord(id, 'article', message, link);
    return res;
  }

  /**
   * @author frank harerimana
   * @param {*} users
   * @param {*} author
   * @param {*} slug
   * @returns {*} user
   */
  static async sendNotifications(users, author, slug) {
    const notificationLink = await new mailLinkMaker(`${slug}`).article();
    const message = `${author} published a new article`;
    for (let i = 0; i < users.length; i += 1) {
      this.NewNotification(users[i].id, message, notificationLink);
      if (users[i].email_notifications === true) {
        Mailer.messageMaker(users[i].email, 'no-reply Authors haven', message, `
    <strong>click the link below to view the article<strong> 
    <a href='${notificationLink}'>Author's haven</a>`);
      }
    }
    return 'success';
  }

  /**
   * @author frank harerimana
   * @param {*} authorId
   * @param {*} slug
   * @returns {*} success
   */
  static async createArticle(authorId, slug) {
    try {
      const userArray = [];
      const followers = await followersModel.followers(authorId);
      followers.map(element => userArray.push(element.dataValues.follower));
      const result = [];
      // check user emails and notification settings
      for (let i = 0; i < userArray.length; i += 1) {
        result.push(this.user(userArray[i]));
      }
      const res = await Promise.all(result);
      const users = res.map((element) => {
        const respo = element.dataValues;
        return respo;
      });
      const author = await UserModel.findUser(authorId);
      await this.sendNotifications(users, author.dataValues.username, slug);
      return 'success';
    } catch (error) {
      return error;
    }
  }
}

export default Notifications;
