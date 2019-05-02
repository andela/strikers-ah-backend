module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('followers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', key: 'id', onDelete: 'CASCADE'
      }
    },
    follower: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', key: 'id', onDelete: 'CASCADE'
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
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('followers')
};
