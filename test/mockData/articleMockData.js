import faker from 'faker';

module.exports = {
  title: faker.random.words(),
  description: faker.lorem.sentences(),
  body: faker.lorem.sentences(),
  authorid: faker.random.number(),
};
