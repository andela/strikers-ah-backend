/* eslint-disable no-unused-vars */


module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bookmarks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE'
      }
    },
    articleid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id',
        onDelete: 'CASCADE'
      }
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('bookmarks')
};
