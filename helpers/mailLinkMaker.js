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
    return `${process.env.FRONTEND_URL}/resetpassword/${this.token}`;
  }

  /**
 * @author frank harerimana
 * @param {*} identifier
 * @return {*} link
 */
  async article() {
    return `${process.env.FRONTEND_URL}/article/${this.token}`;
  }
}

export default MailLinkMaker;
