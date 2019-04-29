

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provideruserid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verified: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    inapp_notifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    email_notifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    role: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'User'
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

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([queryInterface.dropTable('users')])
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */

};
