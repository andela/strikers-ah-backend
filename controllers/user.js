/* eslint-disable class-methods-use-this */
import model from '../models/index';

const { user: UserModel } = model;
/**
 * @author frank harerimana
 */
class User {
  /**
   * @author frank harerimana
   * @param {*} req user from social
   * @param {*} res logged
   * @returns { object } user logged in
   */
  static async socialLogin(req, res) {
    const ruser = {
      username: req.user.username,
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      image: req.user.image,
      provider: req.user.provider,
      provideruserid: req.user.provideruserid
    };
    const result = await new UserModel().socialUsers(ruser);
    return res.status(200).json({
      username: result.username,
      email: result.email,
      bio: result.bio,
      image: result.image,
      createAt: result.createAt,
    });
  }
}
export default User;
