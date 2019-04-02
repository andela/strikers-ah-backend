import sequelize from 'sequelize';
import db from '../database/config';

const User = db.define('user', {
  id: {
    type: sequelize.UUID,
    defaultValue: sequelize.UUID,
    primaryKey: true
  },
  firstname: {
    type: sequelize.STRING(50),
    allowNull: false,
  },
  lastname: {
    type: sequelize.STRING(50),
  },
  username: {
    type: sequelize.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: sequelize.STRING(60),
    allowNull: false,
    unique: true,
  },
  bio: {
    type: sequelize.TEXT,
    allowNull: true,
  },
  password: {
    type: sequelize.STRING(125),
    allowNull: true,
  },
  image: {
    type: sequelize.STRING(255),
    allowNull: true,
  }
});
User.sync();
export default User;
