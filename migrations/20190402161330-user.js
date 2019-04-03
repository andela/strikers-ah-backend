

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    provideruserid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      default: true
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }


  }),

  down: queryInterface => queryInterface.dropTable('users')
};
