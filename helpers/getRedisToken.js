import client from '../config/redisConfig';

const checkToken = async (res, token, next) => {
  await client.get(token, (err, reply) => {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: err
      });
    }
    if (reply === 'blacklisted') {
      return res.send({
        status: 401,
        error: 'Token is no longer valid'
      });
    }
    next();
  });
};

export default checkToken;
