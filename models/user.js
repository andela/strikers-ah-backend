module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provideruserid: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {});
  return User;
};
