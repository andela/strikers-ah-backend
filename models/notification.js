

const NotificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false }
  });
  Notification.user = (userid, message) => Notification.create({ userid, message });
  // notification.associate = function (models) {
  //   // associations can be defined here
  // };
  return Notification;
};
export default NotificationModel;
