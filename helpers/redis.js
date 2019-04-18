import client from '../config/redisConfig';

const blacklistToken = (res, token) => {
  client.set(token, 'blacklisted', (err) => {
    if (err) {
      return res.status(500).send({
        status: 500,
        error: err
      });
    }
    return res.status(200).send({
      status: 200,
      message: 'Successfully logged out'
    });
  });
};

export default blacklistToken;
