import dotenv from 'dotenv';
import Encrypt from './encrypt';

dotenv.config();
/**
 * Mailing link maker
 */
class MailLinkMaker {
  /**
     * @param {*} _identifier
     * @param {*} _token
     */
  constructor(_identifier, _token) {
    this.identifier = _identifier;
    this.token = _token;
    this.encr = new Encrypt(this.identifier);
  }

  /**
 * @author frank harerimana
 * @param {*} identifier
 * @return {*} link
 */
  async resetPasswordLink() {
    return `${process.env.APP_URL}/api/v1/login/resetpassword/${this.token}/${this.encr.encrypt()}`;
  }
}

export default MailLinkMaker;
