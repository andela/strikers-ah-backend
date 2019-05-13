module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('commenthistory', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    commentid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    oldcomment: {
      type: Sequelize.STRING,
      allowNull: false
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
  down: (queryInterface, Sequelize) => Promise.all([queryInterface.dropTable('commenthistory')])

};
