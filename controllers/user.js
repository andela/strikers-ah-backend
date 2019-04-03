import uuid from 'uuid';
import select from 'lodash';
import userModel from '../models/user';
import helper from '../helpers/helper';

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
}

export default User;
