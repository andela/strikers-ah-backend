import redis from 'redis';
import dotenv from 'dotenv';

const logger = require('pino')();

dotenv.config();

const client = redis.createClient({
  url: process.env.REDISURL
});
client.on('connect', (error) => {
  if (error) {
    logger.error(error);
  }
  logger.info('redis connected successfully');
});
client.on('error', (error, result) => {
  if (error) {
    return logger.error(error);
  }
  logger.info(result);
});

export default client;
