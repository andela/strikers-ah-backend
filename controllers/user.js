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
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: await helper.hashPassword(data.password),
        username: data.username
      };
      // check if the user does not already exist
      const emailUsed = await userModel.findOne({ where: { email: newUser.email } });
      const userNameUsed = await userModel.findOne({ where: { username: newUser.username } });
      if (emailUsed && userNameUsed) {
        res.status(400).json({ error: 'Email and username are already in use' });
      } if (emailUsed) {
        res.status(400).json({ error: 'The Email is already in use' });
      } else if (userNameUsed) {
        res.status(400).json({ error: 'The username is not available' });
      } else {
        const insertedUser = await userModel.create(newUser);
        const token = helper.generateToken(select.pick(insertedUser, ['username', 'email', 'firstname', 'lastname']));
        res.header('x-auth-token', token).status(201).json({
          user: {
            username: insertedUser.username,
            email: insertedUser.email,
            password: insertedUser.password
          },
          token
        });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
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
      if (user.email) {
        // verify password
        if (helper.comparePassword(password, user.password)) {
          // return user and token
          const userAccount = select.pick(user, ['firstname', 'lastname', 'username', 'email', 'bio', 'image']);
          const token = helper.generateToken(userAccount);
          return res.header('x-auth-token', token).status(200).json({ user: { ...userAccount, token } });
        }
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      return res.status(401).json({ error: 'Invalid username or password' });
    } catch (error) {
      return res.status(500).json({ error: `Server Error: ${error}` });
    }
  }
}

export default User;
