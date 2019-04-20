

const followingModel = (sequelize, DataTypes) => {
  const Following = sequelize.define('following', {
    followee: { type: DataTypes.INTEGER, allowNull: false },
    follower: { type: DataTypes.INTEGER, allowNull: false }
  });
  Following.newRecord = (followee, follower) => Following.create({ followee, follower });
  Following.finder = (followee, follower) => Following.findOne({ where: { followee, follower } });
  Following.followings = followee => Following.count({ where: { followee } });
  Following.DeleteRe = (followee, follower) => Following.destroy({ where: { followee, follower } });
  Following.followers = follower => Following.count({ where: { follower } });
  // Following.associate = function (models) {
  //   // associations can be defined here
  // };
  return Following;
};
export default followingModel;
