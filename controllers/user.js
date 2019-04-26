import select from 'lodash';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailLinkMaker from '../helpers/mailLinkMaker';
import model from '../models/index';
import Mailer from '../helpers/mailer';
import helper from '../helpers/helper';
import blacklist from '../helpers/redis';
import { sendAccountVerification as mailingHelper } from '../helpers/mailing';

const { Op } = Sequelize;
dotenv.config();

const {
  user: UserModel, userverification: UserVerificationModel,
  resetpassword: resetPassword, following: followingModel,
  followers: followersModel
} = model;

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
      const newUser = { ...data };
      // check if the user does not already exist
      const emailUsed = await UserModel.findOne({ where: { email: newUser.email } });
      const userNameUsed = await UserModel.findOne({ where: { username: newUser.username } });
      const uniqueEmailUsername = helper.handleUsed(emailUsed, userNameUsed);
      if (uniqueEmailUsername === true) {
        const result = await UserModel.create(newUser);
        // Email verification
        const verificationHash = mailingHelper(result.email, `${result.firstname} ${result.lastname}`);
        const verification = {
          userid: result.id,
          hash: verificationHash,
          status: 'Pending'
        };
        await UserVerificationModel.create(verification);
        //
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
    const { email: username } = req.body;
    try {
      const user = await UserModel.findOne({ where: { [Op.or]: [{ email }, { username }] } });
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
   * @author: Clet Mwunguzi
   * @param {Object} req -- request object
   * @param {Object} res  -- response object
   * @returns { Middleware } -- returns nothing
   */
  static async logout(req, res) {
    const token = req.headers['x-access-token'] || req.headers.authorization;
    await blacklist(res, token);
  }


  /**
   * @author: Clet Mwunguzi
   * @param {Object} req -- request object
   * @param {Object} res  -- response object
   * @returns { Middleware } -- returns nothing
   */
  static welcomeUser(req, res) {
    return res.status(200).send('Welcome');
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

  /**
   * @author Jacques Nyilinkindi
   * @param {*} req
   * @param {*} res
   * @returns { object } response
   */
  static async verifyUser(req, res) {
    const { hash } = req.params;
    try {
      const verify = await UserVerificationModel.findOne({ where: { hash, status: 'Pending' } });
      // verification
      if (verify) {
        // verify user
        const { userid: id } = verify;
        await UserModel.update({ verified: true }, { where: { id } });
        await UserVerificationModel.update({ status: 'Used' }, { where: { hash, userid: id } });
        return res.status(200).json({ message: 'Account verified' });
      }
      return res.status(401).json({ error: 'Verification token not found' });
    } catch (error) {
      const status = (error.name === 'SequelizeValidationError') ? 400 : 500;
      return res.status(status).json({ error: `${error.message}` });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} success
   */
  static async follow(req, res) {
    try {
      const { username } = req.params;
      const followedUser = await UserModel.checkUser(username);
      if (req.user !== followedUser.id) {
        const checker = await followingModel.findRecord(req.user, followedUser.id);
        if (!checker) {
          await followingModel.newRecord(req.user, followedUser.id);
          await followersModel.newRecord(followedUser.id, req.user);
        }
        res.status(201).json({
          status: 201,
          message: 'followed',
          follower: followedUser.username
        });
      } else {
        res.status(409).json({
          status: 409,
          message: 'you can\'t follow you self',
        });
      }
    } catch (error) {
      res.status(400).json({ status: 400, error: 'bad request' });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} unfollow
   */
  static async unfollow(req, res) {
    try {
      const { username } = req.params;
      const unfollowedUser = await UserModel.checkUser(username);
      if (req.user !== unfollowedUser.id) {
        const checker = await followingModel.findRecord(req.user, unfollowedUser.id);
        if (!checker) {
          await followingModel.unfollow(req.user, unfollowedUser.id);
          await followersModel.unfollow(unfollowedUser.id, req.user);
        }
        res.status(201).json({
          status: 201,
          message: 'unfollowed',
          follower: unfollowedUser.username
        });
      } else {
        res.status(409).json({
          status: 409,
          message: 'you can\'t unfollow you self',
        });
      }
    } catch (error) {
      res.status(400).json({ status: 400, error: 'bad request' });
    }
  }
}
export default User;
