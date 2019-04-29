module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articleHighLightComments', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER },
    articleHighlightId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comment: { type: Sequelize.STRING, allowNull: false },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('articleHighLightComments')
};
