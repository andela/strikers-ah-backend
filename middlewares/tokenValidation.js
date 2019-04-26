import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import promiseResolver from '../helpers/promiseResolver';

dotenv.config();

const validateToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) { return res.status(401).send({ status: 401, error: 'Token is not Supplied' }); }

  if (token.startsWith('Bearer ')) { token = token.slice(7, token.length); }
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.secretKey);
      const resolver = await promiseResolver(token);
      if (resolver === 'blacklisted') { return res.send({ status: 401, error: 'Token is no longer valid' }); }

      const { id: userid } = decoded;
      req.user = userid;
      next();
    } catch (error) { res.status(400).send({ status: 400, message: error }); }
  }
};

export default validateToken;
