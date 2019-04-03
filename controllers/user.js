/**
 * @author frank harerimana
 */
class User {
  /**
   * @author frank harerimana
   * @param {*} req Social user
   * @param {*} res logged
   * @returns { object } user logged in
   */
  static socialLogin(req, res) {
    const user = {
      username: req.user.username,
      email: req.user.email,
    };
    return res.status(200).json({
      data: user,
    });
  }
}
export default User;
