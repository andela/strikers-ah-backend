/**
 * @author frank harerimana
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {*} reset password model
 */
const ResetPassword = (sequelize, DataTypes) => {
  const resetpassword = sequelize.define('resetpassword', {
    token: { type: DataTypes.TEXT, allowNull: false },
  });
  resetpassword.recordNewReset = token => resetpassword.create({ token });
  resetpassword.checkToken = token => resetpassword.findOne({ where: { token } });
  return resetpassword;
};
export default ResetPassword;
