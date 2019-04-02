import userModel from '../models/user';
import helper from '../helpers/helper';
/**
 * @param { class } User -- User }
 */
class User {
  /**
   * @param {Object} req -- request object
   * @param {Object} res  -- response object
   * @returns { null } -- returns nothing
   * @param {String} author -- Mwibutsa Floribert
   */
  async signUpWithEmail(req, res) {
    this.req = req;
    this.res = res;
    // get request values
    const {
      firsname, lastname, email, password, username
    } = this.req.body;
    // register user in the database
    this.user = await userModel.create({
      firsname, lastname, email, password: await helper.hashPassword(password), username
    });
    return res.status(201).json({
      user: {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password
      }
    });
  }
}

const user = new User();
export default user;
