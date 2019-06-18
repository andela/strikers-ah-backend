/* eslint-disable indent */
/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ArticleLikesAndDislikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      like_value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ArticleLikesAndDislikes')
};
