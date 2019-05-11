const notificationModel = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('notifications', {
    userid: DataTypes.INTEGER,
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    link: DataTypes.TEXT
  }, {});
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
  };
  Notifications.newRecord = (userid, type, message, link) => {
    Notifications.create({
      userid, type, message, link
    });
  };
  return Notifications;
};

export default notificationModel;
