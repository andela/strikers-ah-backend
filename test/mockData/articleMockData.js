import faker from 'faker';

module.exports = {
  title: faker.random.words(),
  description: faker.lorem.paragraphs(),
  body: faker.lorem.paragraphs(),
};
