import client from '../config/redisConfig';

const blacklistToken = token => client.set(token, 'blacklisted');

export default blacklistToken;
