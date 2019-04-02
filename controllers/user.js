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
    // get request values
    const {
      firstname, lastname, email, password, username
    } = req.body;
    let insertedUser;
    let token;
    // register user in the database
    try {
      const newUser = {
        id: uuid.v4(),
        firstname,
        lastname,
        email,
        password: await helper.hashPassword(password),
        username
      };
      // check if the user does not already exist
      const emailUsed = await userModel.findOne({ where: { email: newUser.email } });
      const userNameUsed = await userModel.findOne({ where: { username: newUser.username } });
      if (emailUsed && userNameUsed) {
        return res.status(400).json({ error: 'Email and username are already in use' });
      }
      if (emailUsed) {
        return res.status(400).json({ error: 'The Email is already in use' });
      }
      if (userNameUsed) {
        return res.status(400).json({ error: 'The username is not available' });
      }
      insertedUser = await userModel.create(newUser);
      token = helper.generateToken(select.pick(insertedUser, ['username', 'email', 'firstname', 'lastname']));
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
    return res.header('x-auth-token', token).status(201).json({
      user: {
        username: insertedUser.username,
        email: insertedUser.email,
        password: insertedUser.password
      }
    });
  }
}


export default User;
