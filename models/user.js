import sequelize from 'sequelize';
import db from '../database/config';

const User = db.define('user', {
  id: {
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true
  },
  firstname: {
    type: sequelize.STRING,
    allowNull: true,
  },
  lastname: {
    type: sequelize.STRING,
    allowNull: true
  },
  username: {
    type: sequelize.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  bio: {
    type: sequelize.TEXT,
    allowNull: true,
  },
  password: {
    type: sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: sequelize.STRING,
    allowNull: true,
  },
  provider: {
    type: sequelize.STRING,
    allowNull: true
  },
  provideruserid: {
    type: sequelize.STRING,
    allowNull: true
  }
});
User.sync();

export default User;
