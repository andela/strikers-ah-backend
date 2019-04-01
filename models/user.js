import sequelize, { UUIDV4 } from 'sequelize';
import db from '../database/config';

const User = db.define('user', {
  id: {
    type: sequelize.UUID,
    default: UUIDV4,
    primaryKey: true
  },
  firstname: {
    type: sequelize.STRING(30),
    allowNull: false,
  },
  lastname: {
    type: sequelize.STRING(30),
  },
  username: {
    type: sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  email: {
    type: sequelize.STRING(30),
    allowNull: false,
    unique: true,
  },
  bio: {
    type: sequelize.STRING(50),
    allowNull: true,
  },
  password: {
    type: sequelize.STRING(30),
    allowNull: true,
  },
  image: {
    type: sequelize.STRING(50),
    allowNull: true,
  }
});
User.sync({ force: false });

export default User;
