
module.exports = (sequelize, DataTypes) => {
  const bookmark = sequelize.define('bookmark', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userid: DataTypes.INTEGER,
    articleid: DataTypes.INTEGER
  }, {});
  bookmark.bookmark = (userid, articleid) => bookmark.create({ userid, articleid });
  bookmark.checkuser = (userid, articleid) => bookmark.findOne({ where: { userid, articleid } });
  bookmark.associate = (models) => {
    bookmark.belongsTo(models.user, {
      foreignKey: 'userid', onDelete: 'CASCADE'
    });
  };
  bookmark.associate = (models) => {
    bookmark.belongsTo(models.article, {
      foreignKey: 'articleid', onDelete: 'CASCADE'
    });
  };
  return bookmark;
};
