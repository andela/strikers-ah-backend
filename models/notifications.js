const notificationModel = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('notifications', {
    userid: DataTypes.INTEGER,
    category: DataTypes.STRING,
    message: DataTypes.STRING,
    link: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {});
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.user, { foreignKey: 'userid', onDelete: 'CASCADE' });
  };
  Notifications.newRecord = (userid, category, message, link) => {
    Notifications.create({
      userid, category, message, link,
    });
  };
  Notifications.findAllNotification = userid => Notifications.findAll({
    where: { userid },
    order: [
      ['status', 'DESC'],
      ['createdAt', 'DESC']
    ]
  });
  Notifications.read = (id, userid) => Notifications.update({ status: 'Read' }, { where: { id, userid } });
  return Notifications;
};

export default notificationModel;
