import uuid from 'uuid';
import select from 'lodash';
import Sequelize from 'sequelize';
import userModel from '../models/user';
import helper from '../helpers/helper';

const { Op } = Sequelize;
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
        id: uuid.v4(),
        ...data,
        password: await helper.hashPassword(data.password),
      };
      // check if the user does not already exist
      const emailUsed = await userModel.findOne({ where: { email: newUser.email } });
      const userNameUsed = await userModel.findOne({ where: { username: newUser.username } });
      const uniqueEmailUsername = helper.handleUsed(emailUsed, userNameUsed);
      if (uniqueEmailUsername === true) {
        const insertedUser = select.pick(await userModel.create(newUser), ['username', 'email', 'firstname', 'lastname']);
        const token = helper.generateToken(insertedUser);
        return res.header('x-auth-token', token).status(201).json({
          user: { ...insertedUser },
          token
        });
      }
      return res.status(400).json({ error: uniqueEmailUsername });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
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
      const user = await userModel.findOne({ where: { [Op.or]: [{ email }, { username: email }] } });
      // verify password
      if (user && helper.comparePassword(password, user.password)) {
        // return user and token
        const userAccount = select.pick(user, ['firstname', 'lastname', 'username', 'email', 'bio', 'image']);
        const token = helper.generateToken(userAccount);
        return res.header('x-auth-token', token).status(200).json({ user: { ...userAccount, token } });
      }
      return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
      return res.status(500).json({ error: `Server Error: ${error}` });
    }
  }
}

export default User;
