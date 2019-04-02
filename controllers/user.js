import userModel from '../models/user';
/**
 * Adds contains all user methods.
 */
class User {
/**
 * @author Jacques Nyilinkindi
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} Returns the response
 */
  static async twitterLogin(req, res) {
    return res.json({ status: 200 });
  }

  /**
 * @author Jacques Nyilinkindi
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} Returns the response
 */
  static async twitterCallback(req, res) {
    return res.json({ status: 200 });
  }
}

export default User;
