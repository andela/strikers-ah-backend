import joi from 'joi';
import schema from '../helpers/schema';
/**
 * @param {class} Validations
 */
class Validations {
  /**
   * @author: Mwibutsa Floribert
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {middleware}-- Middleware
   */
  static async signUpValidations(req, res, next) {
    try {
      await joi.validate(req.body, schema.signUpSchema, schema.options);
    } catch (error) {
      return res.status(400).json({ error: error.details });
    }
    next();
  }

  /**
   * @author: Mwibutsa Floribert
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @return {middleware} description
   */
  static async loginValidations(req, res, next) {
    try {
      await joi.validate(req.body, schema.loginSchema, schema.options);
    } catch (error) {
      return res.status(400).json({ error: error.details });
    }
    next();
  }
}
export default Validations;
