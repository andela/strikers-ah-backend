/* eslint-disable class-methods-use-this */
import Mailer from './mailer';
/**
 * Class for sending mail
 */
class Notification {
  /**
   * @author frank harerimana
   * @param {*} dataValues
   * @param {*} followee
   * @param {*} link
   * @returns {*} ready email
   */
  constructor(dataValues, followee, link) {
    this.id = dataValues.id;
    this.email = dataValues.email;
    this.mailNotfication = dataValues.emailnotify;
    this.followee = followee;
    this.link = link;
  }

  /**
   * @author frank harerimana
   * @param {*} follower
   * @returns {*} notify follower
   */
  async follow() {
    if (this.mailNotfication === true) {
      await new Mailer(this.email, 'notification', this.link).sender();
    }
    return 'notification sent';
  }
}

export default Notification;
