const shareModel = (sequelize, DataTypes) => {
  const share = sequelize.define('share', {
    userid: DataTypes.INTEGER,
    articleid: DataTypes.INTEGER
  }, {});
  share.associate = (models) => {
    share.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
    share.belongsTo(models.article, { foreignKey: 'articleid', onDelete: 'CASCADE' });
  };
  share.newRecord = (userid, articleid) => share.create({ userid, articleid });
  return share;
};

export default shareModel;
