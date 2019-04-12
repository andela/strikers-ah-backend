import dotenv from 'dotenv';

dotenv.config();
/**
 * @author frank harerimana
 * Mailing link maker
 */
class MailLinkMaker {
  /**
     * @param {*} _token
     */
  constructor(_token) {
    this.token = _token;
  }

  /**
 * @author frank harerimana
 * @param {*} identifier
 * @return {*} link
 */
  async resetPasswordLink() {
    return `${process.env.APP_URL}/api/v1/login/resetpassword/${this.token}`;
  }
}

export default MailLinkMaker;
