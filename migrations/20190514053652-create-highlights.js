module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('highlights', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: { type: Sequelize.INTEGER },
    articleid: { type: Sequelize.INTEGER },
    startposition: { type: Sequelize.INTEGER },
    endposition: { type: Sequelize.INTEGER },
    textcontent: { type: Sequelize.STRING },
    highlighted: { type: Sequelize.BOOLEAN },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('highlights')
};
