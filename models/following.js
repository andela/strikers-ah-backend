const followingModel = (sequelize, DataTypes) => {
  const Following = sequelize.define('following', {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    following: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Following.associate = (models) => {
    Following.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
    Following.belongsTo(models.user, { foreignKey: 'following', onDelete: 'CASCADE' });
  };
  Following.newRecord = (userid, following) => Following.create({ userid, following });
  Following.findRecord = (userid, following) => Following.findOne({ where: { userid, following } });
  Following.unfollow = (userid, following) => Following.destroy({ where: { userid, following } });
  return Following;
};
export default followingModel;
