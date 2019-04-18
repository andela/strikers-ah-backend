/* eslint-disable class-methods-use-this */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Class for sending mail
 */
class Mailer {
  /**
   * @author frank harerimana
   * @param {*} _to
   * @param {*} _subject
   * @param {*} _link
   * @returns {*} ready email
   */
  constructor(_to, _subject, _link) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.to = _to;
    this.subject = _subject;
    this.link = _link;
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
   * @returns {*} success
   */
  async sender() {
    await sgMail.send(this.msg);
    return 'success';
  }
}

export default Mailer;
