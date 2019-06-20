import select from 'lodash';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mailLinkMaker from '../helpers/mailLinkMaker';
import model from '../models/index';
import Mailer from '../helpers/mailer';
import helper from '../helpers/helper';
import { sendAccountVerification as mailingHelper } from '../helpers/mailing';
import blacklist from '../helpers/redis';
import UserEvents from '../helpers/userEvents';

// const debugLogger = debug('app:*');

/* eslint-disable class-methods-use-this */

const notify = new UserEvents();
// register events
notify.on('verified', args => notify.verifyingAccount(args));
notify.on('resetpassword', args => notify.resetpassword(args));
const { Op } = Sequelize;
dotenv.config();

const {
  user: UserModel,
  userverification: UserVerificationModel,
  resetpassword: resetPassword,
  following: followingModel,
  followers: followersModel,
  notifications: notificationModel,
  articlereadingstats: ArticleReadingStats,
  roleassignment: AssignRoleModel,
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
    const data = req.body;
    const newUser = {
      ...data,
    };
    // check if the user does not already exist
    const emailUsed = await UserModel.findOne({
      where: {
        email: newUser.email,
      },
    });
    const userNameUsed = await UserModel.findOne({
      where: {
        username: newUser.username,
      },
    });
    const uniqueEmailUsername = helper.handleUsed(emailUsed, userNameUsed);
    if (uniqueEmailUsername === true) {
      const result = await UserModel.create(newUser);
      // Email verification
      const verificationHash = mailingHelper(result.email, `${result.firstname} ${result.lastname}`);
      const verification = {
        userid: result.id,
        hash: verificationHash,
        status: 'Pending',
      };
      await UserVerificationModel.create(verification);

      let userAccount = select.pick(result, ['id', 'firstname', 'lastname', 'username', 'email', 'image', 'verified']);
      const token = helper.generateToken(userAccount);
      userAccount = select.pick(result, ['username', 'email', 'bio', 'image']);
      return helper.authenticationResponse(res, token, userAccount);
    }
    return res.status(400).json({
      error: uniqueEmailUsername,
    });
  }

  /**
   * @author Mwibutsa Floribert
   * @param {Object} req
   * @param {Object} res
   * @returns { null } --
   */
  static async loginWithEmail(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [
          {
            email,
          },
          {
            username: email,
          },
        ],
      },
    });
    // verify password
    if (user && helper.comparePassword(password, user.password)) {
      // return user and token
      let userAccount = select.pick(user, ['id', 'firstname', 'lastname', 'username', 'email', 'image', 'verified']);
      const token = helper.generateToken(userAccount);
      userAccount = select.pick(user, ['username', 'email', 'bio', 'image']);
      return helper.authenticationResponse(res, token, userAccount);
    }
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  /**
   * @author: Clet Mwunguzi
   * @param {Object} req -- request object
   * @param {Object} res  -- response object
   * @returns { Middleware } -- returns nothing
   */
  static async logout(req, res) {
    const token = req.headers['x-access-token'] || req.headers.authorization;
    const blacklisting = await blacklist(token);
    if (blacklisting) {
      return res.status(200).send({
        status: 200,
        message: 'Successfully logged out',
      });
    }
    return res.status(500).send({
      status: 500,
      error: 'Something went wrong',
    });
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
      provideruserid: req.user.provideruserid,
      verified: true
    };
    const result = await UserModel.socialUsers(ruser);
    let userAccount = select.pick(result, ['id', 'firstname', 'lastname', 'username', 'email', 'image', 'verified']);
    const token = helper.generateToken(userAccount);
    userAccount = select.pick(result, ['username', 'email', 'bio', 'image']);
    return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
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
      const token = jwt.sign({ id: search.dataValues.id }, process.env.secretKey);
      // store token and userID
      await resetPassword.recordNewReset(`${token}`);
      // Generate link and send it in email
      const link = await new mailLinkMaker(`${token}`);
      // Mailing the link
      const resetLink = await link.resetPasswordLink();
      const result = await new Mailer(email, 'Password reset', resetLink).sender();
      res.status(202).json({
        message: result,
        email,
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
    if (!check) {
      return res.status(400).json({ message: 'invalid token' });
    }
    try {
      const decode = jwt.verify(token, process.env.secretKey);
      const second = (new Date().getTime() - check.dataValues.createdAt.getTime()) / 1000;
      if (second > 600) {
        return res.status(400).json({ message: 'token has expired' });
      }
      const { password } = req.body;
      const result = await UserModel.resetpassword(password, decode.id);
      notify.emit('resetpassword', decode.id);
      res.status(201).json({
        data: result,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
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
        notify.emit('verified', id);
        return res.redirect(`${process.env.FRONTEND_URL}`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}?invalidVerification`);
    } catch (error) {
      const status = error.name === 'SequelizeValidationError' ? 400 : 500;
      return res.redirect(`${process.env.FRONTEND_URL}?${status}`);
    }
  }

  /**
   * @author Mwibutsa Floribert
   * @param {Object} req request containing new user details
   * @param {Object} res response containing edit user details
   * @returns { Object } updated user details
   */
  static async editProfile(req, res) {
    const { body: data } = req;
    const { email, username } = helper.decodeToken(req);
    const updatedUser = await UserModel.update(
      {
        ...data,
        email: email.length ? email : data.email,
        username: username.length ? username : data.username,
        image: data.image,
      },
      {
        where: {
          username,
        },
        returning: true,
      },
    );
    res
      .status(201)
      .json(select.pick(updatedUser[1][0], ['firstname', 'lastname', 'email', 'username', 'bio', 'image']));
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
      if (req.user.id !== followedUser.id) {
        const checker = await followingModel.findRecord(req.user.id, followedUser.id);
        if (!checker) {
          await followingModel.newRecord(req.user.id, followedUser.id);
          await followersModel.newRecord(followedUser.id, req.user.id);
        }
        res.status(201).json({
          status: 201,
          message: 'followed',
          follower: followedUser.username,
        });
      } else {
        res.status(409).json({
          status: 409,
          message: "you can't follow you self",
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
      if (req.user.id !== unfollowedUser.id) {
        const checker = await followingModel.findRecord(req.user.id, unfollowedUser.id);
        if (checker) {
          await followingModel.unfollow(req.user.id, unfollowedUser.id);
          await followersModel.unfollow(unfollowedUser.id, req.user.id);
        }
        res.status(201).json({
          status: 201,
          message: 'unfollowed',
          follower: unfollowedUser.username,
        });
      } else {
        res.status(409).json({
          status: 409,
          message: "you can't unfollow you self",
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
   * @returns {*} notifications
   */
  static async notifications(req, res) {
    try {
      const { user } = req;
      const profile = await UserModel.checkUser(user.username);
      const result = await notificationModel.findAllNotification(profile.dataValues.id);
      res.status(200).json({
        status: 200,
        count: result.length,
        notifications: result,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: 'bad request',
      });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} read notification
   */
  static async readNotification(req, res) {
    try {
      const notificationId = req.params.id;
      const userId = req.user.id;
      const notification = await notificationModel.read(notificationId, userId);
      res.status(201).json({
        status: 201,
        notification,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: 'bad request',
      });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} followers
   */
  static async findAllFollowers(req, res) {
    try {
      const { user } = req;
      const profile = await UserModel.checkUser(user.username);
      const followers = await followersModel.followers(profile.dataValues.id);
      res.status(200).json({
        status: 200,
        followers: followers.length,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: 'bad request',
      });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} followings
   */
  static async findAllFollowing(req, res) {
    try {
      const { user } = req;
      const profile = await UserModel.checkUser(user.username);
      const followings = await followingModel.followings(profile.dataValues.id);
      res.status(200).json({
        status: 200,
        following: followings.length,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: 'bad request',
      });
    }
  }

  /**
   * @author frank harerimana
   * @param {*} req
   * @param {*} res
   * @returns {*} profile relationship status
   */
  static async findProfilestatus(req, res) {
    try {
      const { username } = req.params;
      const profile = await UserModel.checkUser(username);
      const { user } = req;
      // check if user follows the profile
      const profileId = profile.dataValues.id;
      const following = await followingModel.following(user.id, profileId);
      res.status(200).json({
        status: 200,
        response: following === null ? 'false' : 'true',
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: 'incorrent profile',
      });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get User Reading History
   */
  static async getReadingHistory(req, res) {
    if (!req.params.username) {
      return helper.jsonResponse(res, 400, { message: 'Provide username' });
    }
    const userDetails = await UserModel.findOne({ where: { username: req.params.username } });
    if (!userDetails) {
      return helper.jsonResponse(res, 404, { message: 'User not found' });
    }
    try {
      const stats = await ArticleReadingStats.readingStats('user', userDetails.id);
      if (!stats || stats.length === 0) {
        return helper.jsonResponse(res, 404, { message: 'No article read' });
      }
      return helper.jsonResponse(res, 200, { stats, statsCount: stats.length });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get All Users
   */
  static async getAllUsers(req, res) {
    try {
      const profiles = await UserModel.allUsers();
      return helper.jsonResponse(res, 200, { profiles, profileCount: profiles.length });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get User Information
   */
  static async getUserInformation(req, res) {
    if (!req.params.username) {
      return helper.jsonResponse(res, 400, { message: 'Provide username' });
    }
    try {
      const profile = await UserModel.singleUser(req.params.username);
      if (!profile) {
        return helper.jsonResponse(res, 404, { message: 'User not found' });
      }
      return helper.jsonResponse(res, 200, { profile });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Assign role to user
   */
  static async assignRole(req, res) {
    if (req.userRole !== 'Admin') {
      return helper.jsonResponse(res, 401, { message: 'Unauthorized access' });
    }
    if (!req.params.username) {
      return helper.jsonResponse(res, 400, { message: 'Provide username' });
    }
    const { role } = req.body;
    if (!role || !role.trim()) {
      return helper.jsonResponse(res, 400, { message: 'Provide new role' });
    }
    const roles = ['User', 'Admin', 'Moderator'];
    if (!roles.includes(role)) {
      return helper.jsonResponse(res, 400, { message: 'Role not known' });
    }
    try {
      const profile = await UserModel.findOne({ where: { username: req.params.username } });
      if (!profile) {
        return helper.jsonResponse(res, 404, { message: 'User not found' });
      }
      const { id: userid } = profile;
      let message = `${profile.username}'s role is already ${role}`;
      if (role === profile.role) {
        return helper.jsonResponse(res, 404, { message });
      }
      const assigned = await AssignRoleModel.create({ userid, role, assignedby: req.user });
      if (!assigned) {
        return helper.jsonResponse(res, 400, { message: 'Something went wrong' });
      }
      await UserModel.update({ role }, { where: { id: userid }, returning: true });
      message = `${profile.username}'s role is now ${role}`;
      return helper.jsonResponse(res, 200, { message });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   * @author Mwibutsa Floribert
   * @param { object } req
   * @param { object} res
   * @returns { null } --
   */
  static async getUserProfile(req, res) {
    const { username } = req.params;
    const profile = await UserModel.findOne({
      where: { username },
      include: [{ model: followersModel }, { model: followingModel }],
    });
    if (profile) {
      delete profile.dataValues.password;
      res.status(200).json({ status: 200, profile });
    } else {
      res.status(404).json({ stats: 404, error: 'This page is not available' });
    }
  }
}
export default User;
