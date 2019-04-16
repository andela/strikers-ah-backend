import select from 'lodash';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailLinkMaker from '../helpers/mailLinkMaker';
import model from '../models/index';
import helper from '../helpers/helper';
import Mailer from '../helpers/mailer';

const { Op } = Sequelize;
dotenv.config();
const { user: UserModel, resetpassword: resetPassword } = model;
/**
 * @param { class } User -- User }
 */
class User {
  /**
   * @author: Mwibutsa Floribert
   * @param {Object} req -- request object
   * @param {Object} res  -- response object
   * @returns { Middleware } -- returns nothing
   */
  static async signUpWithEmail(req, res) {
    try {
      const data = req.body;
      const newUser = {
        ...data,
      };
      // check if the user does not already exist
      const emailUsed = await UserModel.findOne({ where: { email: newUser.email } });
      const userNameUsed = await UserModel.findOne({ where: { username: newUser.username } });
      const uniqueEmailUsername = helper.handleUsed(emailUsed, userNameUsed);
      if (uniqueEmailUsername === true) {
        const result = await UserModel.create(newUser);
        let userAccount = select.pick(result, ['id', 'firstname', 'lastname', 'username', 'email', 'image']);
        const token = helper.generateToken(userAccount);
        userAccount = select.pick(result, ['username', 'email', 'bio', 'image']);
        return helper.authenticationResponse(res, token, userAccount);
      }
      return res.status(400).json({ error: uniqueEmailUsername });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns { null } --
   */
  static async loginWithEmail(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({
        where: {
          [Op.or]: [{ email }, { username: email }]
        }
      });
      // verify password
      if (user && helper.comparePassword(password, user.password)) {
        // return user and token
        let userAccount = select.pick(user, ['id', 'firstname', 'lastname', 'username', 'email', 'image']);
        const token = helper.generateToken(userAccount);
        userAccount = select.pick(user, ['username', 'email', 'bio', 'image']);
        return helper.authenticationResponse(res, token, userAccount);
      }
      return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
      const status = (error.name === 'SequelizeValidationError') ? 400 : 500;
      return res.status(status).json({ error: `${error.message}` });
    }
  }

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
      bio: req.user.bio,
      image: req.user.image,
      provider: req.user.provider,
      provideruserid: req.user.provideruserid
    };
    const result = await UserModel.socialUsers(ruser);
    let userAccount = select.pick(result, ['id', 'firstname', 'lastname', 'username', 'email', 'image']);
    const token = helper.generateToken(userAccount);
    userAccount = select.pick(result, ['username', 'email', 'bio', 'image']);
    return helper.authenticationResponse(res, token, userAccount);
  }

  /**
 * @author frank harerimana
 * @param {*} req email
 * @param {*} res reset password link
 * @returns {*} mailed link
 */
  static async passwordreset(req, res) {
    const { email } = req.body;
    // check email existance
    const search = await UserModel.checkEmail(email);
    if (search === null || undefined) {
      res.status(404).json({ message: 'no account related to such email', email });
    } else {
      // generate token
      const token = jwt.sign({ id: search.dataValues.id }, process.env.SECRETKEY);
      // store token and userID
      await resetPassword.recordNewReset(`${token}`);
      // Generate link and send it in email
      const link = await new mailLinkMaker(`${token}`);
      // Mailing the link
      const resetLink = await link.resetPasswordLink();
      const result = await new Mailer(email, 'Password reset', resetLink).sender();
      res.status(202).json({
        message: result, email
      });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} update password
   */
  static async resetpassword(req, res) {
    const { token } = req.params;
    const check = await resetPassword.checkToken(token);
    if (!check) { return res.status(400).json({ message: 'invalid token' }); }
    try {
      const decode = jwt.verify(token, process.env.SECRETKEY);
      const second = (new Date().getTime() - check.dataValues.createdAt.getTime()) / 1000;
      if (second > 600) { return res.status(400).json({ message: 'token has expired' }); }
      const { password } = req.body;
      const result = await UserModel.resetpassword(password, decode.id);
      res.status(201).json({
        data: result
      });
    } catch (error) { return res.status(400).json({ message: error.message }); }
  }
}
export default User;
