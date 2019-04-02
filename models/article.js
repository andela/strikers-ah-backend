import Sequelize, { UUIDV4 } from 'sequelize';
import sequelize from '../database/config';

const Article = sequelize.define('article', {
  id: {
    type: Sequelize.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    required: true
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  tagList: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  createdAt: {
    type: Sequelize.DATE,
    required: true,
    defaultValue: new Date()
  },
  updatedAt: {
    type: Sequelize.DATE,
    required: true,
    defaultValue: new Date()
  },
  favorited: {
    type: Sequelize.BOOLEAN,
    required: true,
    defaultValue: false
  },
  favoriteCounts: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  authorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Article.sync({ force: false });

export default Article;
