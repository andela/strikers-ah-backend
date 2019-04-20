import select from 'lodash';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailLinkMaker from '../helpers/mailLinkMaker';
import model from '../models/index';
import Mailer from '../helpers/mailer';
import helper from '../helpers/helper';
import LoggedInUser from '../helpers/LoggedInUser';
import { sendAccountVerification as mailingHelper } from '../helpers/mailing';
/* eslint-disable class-methods-use-this */


const { Op } = Sequelize;
dotenv.config();

const {
  user: UserModel, userverification: UserVerificationModel,
  resetpassword: resetPassword, following: followingModel,
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
        const verificationHash = mailingHelper(result.email, `${result.firstname} ${result.lastname}`);
        const verification = {
          userid: result.id,
          hash: verificationHash,
          status: 'Pending'
        };
        await UserVerificationModel.create(verification);
        const following = await followingModel.followings(result.id);
        const followers = await followingModel.followers(result.id);
        let userAccount = select.pick(result, ['id', 'firstname', 'lastname', 'username', 'email', 'image']);
        const token = helper.generateToken(userAccount);
        userAccount = select.pick(result, ['username', 'email', 'bio', 'image']);
        return helper.authenticationResponse(res, token, userAccount, following, followers);
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
        const following = await followingModel.followings(user.dataValues.id);
        const followers = await followingModel.followers(user.dataValues.id);
        return helper.authenticationResponse(res, token, userAccount, following, followers);
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
    const result = await UserModel.so(ruser);
    let userAccount = select.pick(result[0].dataValues, ['id', 'firstname', 'lastname', 'username', 'email', 'image']);
    const token = helper.generateToken(userAccount);
    const following = await followingModel.followings(result[0].dataValues.id);
    const followers = await followingModel.followers(result[0].dataValues.id);
    userAccount = select.pick(result[0].dataValues, ['username', 'email', 'bio', 'image']);
    return helper.authenticationResponse(res, token, userAccount, followers, following);
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
      res.status(404).json({ status: 4040, message: 'no account related to such email', email });
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
        status: 202,
        message: result,
        email
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
    if (!check) { return res.status(400).json({ status: 400, message: 'invalid token' }); }
    try {
      const decode = jwt.verify(token, process.env.SECRETKEY);
      const second = (new Date().getTime() - check.dataValues.createdAt.getTime()) / 1000;
      if (second > 600) { return res.status(400).json({ message: 'token has expired' }); }
      const { password } = req.body;
      const result = await UserModel.resetpassword(password, decode.id);
      res.status(201).json({
        status: 201,
        data: result
      });
    } catch (error) { return res.status(400).json({ status: 400, message: error.message }); }
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
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) { return res.status(401).json({ status: 401, message: 'authorization required' }); }
    try {
      const { username } = req.params;
      const followedUser = await UserModel.checkUser(username);
      const followee = await new LoggedInUser(bearerHeader).user();
      const checker = await followingModel.finder(followee.id, followedUser.id);
      if (!checker) {
        await followingModel.newRecord(followee.id, followedUser.id);
      } else {
        await followingModel.DeleteRe(followee.id, followedUser.id);
      }
      res.status(201).json({
        status: 201,
        message: !checker ? 'followed' : 'unfollowed',
        follower: followedUser.username
      });
    } catch (error) {
      res.status(400).json({ status: 400, error: 'bad request' });
    }
  }
}
export default User;
