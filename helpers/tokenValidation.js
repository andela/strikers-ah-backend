import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import checkToken from './getRedisToken';

dotenv.config();

const validateToken = async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      status: 400,
      error: 'Token is not Supplied'
    });
  }

  if (token.startsWith('Bearer ')) {
    // eslint-disable-next-line no-const-assign
    token = token.slice(7, token.length);
  }
  if (token) {
    try {
      await jwt.verify(token, process.env.secretKey);
      await checkToken(res, token, next);
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error.message
      });
    }
  }
};

export default validateToken;
