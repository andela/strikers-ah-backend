/**
 * @author frank harerimana
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {*} reset password model
 */
const ResetPassword = (sequelize, DataTypes) => {
  const resetpassword = sequelize.define('resetpassword', {
    token: { type: DataTypes.TEXT, allowNull: false }
  });

  resetpassword.recordNewReset = async (userid, token) => {
    const result = await resetpassword.create({ userId: userid, token });
    return result;
  };

  resetpassword.checkToken = async (token) => {
    const result = await resetpassword.findOne({ where: { token } });
    return result;
  };
  return resetpassword;
};
export default ResetPassword;
