module.exports = (sequelize, DataTypes) => {
  const bookmark = sequelize.define(
    'bookmark',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userid: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      articleid: {
        type: DataTypes.INTEGER,
        references: {
          model: 'articles',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
    },
    {},
  );
  bookmark.bookmark = (userid, articleid) => bookmark.create({ userid, articleid });
  bookmark.checkuser = (userid, articleid) => bookmark.findOne({ where: { userid, articleid } });
  bookmark.associate = (models) => {
    bookmark.belongsTo(models.user, {
      foreignKey: 'userid',
      onDelete: 'CASCADE',
    });
    bookmark.belongsTo(models.article, {
      foreignKey: 'articleid',
      onDelete: 'CASCADE',
    });
  };
  return bookmark;
};
