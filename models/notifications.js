const notificationModel = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('notifications', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'unread' }
  }, {});
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
  };
  Notifications.newRecord = (userid, category, message, link) => {
    Notifications.create({
      userid, category, message, link
    });
  };
  Notifications.findAllNotification = userid => Notifications.findAll({ where: { userid } });
  Notifications.read = (id, userid) => Notifications.update({ status: 'read' }, { where: { id, userid } });
  return Notifications;
};

export default notificationModel;
