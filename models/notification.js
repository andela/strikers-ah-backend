

const NotificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    link: { type: DataTypes.TEXT, allowNull: false }
  });
  Notification.notify = (userid, message, link) => Notification.create({ userid, message, link });
  // notification.associate = function (models) {
  //   // associations can be defined here
  // };
  return Notification;
};
export default NotificationModel;
