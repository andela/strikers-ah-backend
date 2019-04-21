/* eslint-disable class-methods-use-this */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Class for sending mail
 */
class Notification {
  /**
   * @author frank harerimana
   * @param {*} _to
   * @param {*} _subject
   * @param {*} _link
   * @returns {*} ready email
   */
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.formatt();
  }

  /**
 * @author frank harerimana
 * @returns {*} message template
 */
  async formatt() {
    this.msg = {
      to: this.to,
      from: 'harfrank2@gmail.com',
      subject: this.subject,
      html: `<strong>Reset Password</strong><br> 
      <hr>
      <div><br>
      <p> you recently requested to change the password</p>
       Click <a href="${this.link}"> here </a> to Reset your password
       </div>`,
    };
    return this.msg;
  }

  /**
   * @author frank harerimana
   * @param {*} follower
   * @returns {*} notify follower
   */
  follow(follower) {
    return follower;
  }

  /**
   * @author frank harerimana
   * @returns {*} success
   */
  async sender() {
    await sgMail.send(this.msg);
    return 'success';
  }
}

export default Notification;
