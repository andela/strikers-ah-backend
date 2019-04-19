

const followingModel = (sequelize, DataTypes) => {
  const Following = sequelize.define('following', {
    followee: { type: DataTypes.INTEGER, allowNull: false },
    follower: { type: DataTypes.INTEGER, allowNull: false }
  });
  Following.newRecord = (followee, follower) => Following.create({ followee, follower });
  Following.fi = (followee, follower) => Following.findOne({ where: { followee, follower } });
  Following.De = (followee, follower) => Following.destroy({ where: { followee, follower } });
  // Following.associate = function (models) {
  //   // associations can be defined here
  // };
  return Following;
};
export default followingModel;
