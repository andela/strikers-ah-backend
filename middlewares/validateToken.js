import jwt from 'jsonwebtoken';
import models from '../models/index';

const { user: UserModel } = models;

const Auth = {
  /**
    * Verify Token
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {object|void} response object
    */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ status: 401, error: 'No token was provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRETKEY);
      const userInfo = await UserModel.findOne({ where: { id: decoded.id } });
      if (!userInfo) {
        return res.status(403).send({ status: 403, error: 'The token you provided is invalid' });
      }
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      return res.status(400).send({ status: 400, error });
    }
    return true;
  },
};

export default Auth;
