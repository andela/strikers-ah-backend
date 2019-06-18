import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import promiseResolver from '../helpers/promiseResolver';
import client from '../config/redisConfig';
import model from '../models/index';

dotenv.config();

const { user: UserModel } = model;

const validateToken = async (req, res, next) => {
  let token = req.headers['x-access-token']
    || req.headers.authorization
    || req.headers['x-auth-token'];
  if (!token) {
    return res
      .status(401)
      .send({ status: 401, error: 'Token is not Supplied' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.SECRETKEY);
      if (client.connected) {
        const resolver = await promiseResolver(token);
        if (resolver === 'blacklisted') {
          return res.send({ status: 401, error: 'Token is no longer valid' });
        }
      }
      const { id: userid } = decoded;
      const user = await UserModel.findUser(userid);
      if (user) {
        req.user = user.id;
        req.userRole = user.role;
        next();
      } else {
        return res.send({ status: 403, error: 'Forbidden Access' });
      }
    } catch (error) {
      res.status(400).send({ status: 400, message: error });
    }
  }
};

export default validateToken;
