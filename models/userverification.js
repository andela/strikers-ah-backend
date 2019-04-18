const UserVerificationModel = (Sequelize, DataTypes) => {
  const UserVerification = Sequelize.define('userverification', {
    userid: { type: DataTypes.INTEGER, allowNull: false },
    hash: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  UserVerification.prototype.sendVerfication = async () => {
    const result = await UserVerification.Create();
    return result[0].dataValues;
  };
  return UserVerification;
};
export default UserVerificationModel;
