import redis from 'redis';

const client = redis.createClient();
client.on('connect', () => {
// eslint-disable-next-line no-console
  console.log('Redis is connected now...');
});
client.on('error', (err) => {
// eslint-disable-next-line no-console
  console.log('Something went wrong', err);
});

client.set('key-term', 'my test value', redis.print);
client.get('key-term', (error, result) => {
  if (error) {
  // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('Result -->', result);
});
