import dotenv from 'dotenv';

dotenv.config();
/**
 * @author frank harerimana
 * Mailing link maker
 */
class MailLinkMaker {
  /**
     * @param {*} value
     */
  constructor(value) {
    this.value = value;
  }

  /**
 * @author frank harerimana
 * @param {*} identifier
 * @return {*} link
 */
  async resetPasswordLink() {
    return `${process.env.APP_URL}/api/auth/resetpassword/${this.value}`;
  }

  /**
 * @author frank harerimana
 * @returns {*} profile link
 */
  async profile() {
    return `${process.env.APP_URL}/api/users/profile/${this.value}`;
  }
}

export default MailLinkMaker;
