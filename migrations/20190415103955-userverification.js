

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('userverification', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Pending'
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
  down: (queryInterface, Sequelize) => Promise.all([queryInterface.dropTable('userverification')])
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */

};
