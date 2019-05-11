import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * verify the user token
 */
class verifyToken {
  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} verification
   */
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  /**
   * @author frank harerimana
   * verify the user
   * @returns {*} authentication
   */
  verify() {
    const token = this.req.headers.authorization;
    if (!token) {
      return this.res.status(401).send({
        status: 401,
        error: 'authentication failed'
      });
    }
    const split = token.split(' ');
    jwt.verify(split[1], process.env.SECRETKEY, (error, decoded) => {
      if (error) {
        return this.res.status(401).send({
          status: 401,
          error: 'invalid token'
        });
      }
      if (decoded) {
        this.req.user = decoded;
        this.next();
      }
    });
  }
}

export default verifyToken;
