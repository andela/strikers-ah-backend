/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articles', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: Sequelize.STRING, allowNull: false, unique: true },
    title: { type: Sequelize.STRING, required: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    body: { type: Sequelize.TEXT, required: true },
    taglist: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
    authorid: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onDelete: 'CASCADE' } },
    views: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { allowNull: false, type: Sequelize.DATE },
    updatedAt: { allowNull: false, type: Sequelize.DATE },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('articles')
};
