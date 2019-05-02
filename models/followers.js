const followersModel = (sequelize, DataTypes) => {
  const Followers = sequelize.define('followers', {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    follower: {
      type: DataTypes.INTEGER,

    }
  });
  Followers.associate = (models) => {
    Followers.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
    Followers.belongsTo(models.user, { foreignKey: 'follower', onDelete: 'CASCADE' });
  };
  Followers.newRecord = (userid, follower) => Followers.create({ userid, follower });
  Followers.unfollow = (userid, follower) => Followers.destroy({ where: { userid, follower } });
  return Followers;
};
export default followersModel;
