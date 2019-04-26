
import client from '../config/redisConfig';

const tokenPromise = async token => new Promise((resolve) => {
  client.get(token, (err, reply) => {
    resolve(err ? { error: err } : reply);
  });
});

export default tokenPromise;
