import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * this class returns the current user
 */
class LoggedInUser {
  /**
     * @author frank harerimana
     * @param {*} token
     */
  constructor(token) {
    this.token = token;
  }

  /**
 * @returns {*} userId
 */
  async user() {
    const bearer = this.token.split(' ');
    const bearerToken = bearer[1];
    const result = bearerToken;
    const response = await jwt.verify(result, process.env.SECRETKEY);
    return response;
  }
}

export default LoggedInUser;
