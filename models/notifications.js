const notificationModel = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('notifications', {
    userid: DataTypes.INTEGER,
    category: DataTypes.STRING,
    message: DataTypes.STRING,
    link: DataTypes.TEXT
  }, {});
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
  };
  Notifications.newRecord = (userid, category, message, link) => {
    Notifications.create({
      userid, category, message, link
    });
  };
  return Notifications;
};

export default notificationModel;
