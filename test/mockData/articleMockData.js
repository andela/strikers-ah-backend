import faker from 'faker';

module.exports = {
  title: faker.random.words(),
  description: faker.lorem.sentence(),
  body: faker.lorem.paragraphs()
};
