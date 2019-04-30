

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articlereporting', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    articleid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    categoryid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
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
  down: (queryInterface, Sequelize) => Promise.all([queryInterface.dropTable('articlereporting')])
};
