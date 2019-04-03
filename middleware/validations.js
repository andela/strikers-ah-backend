import joi from 'joi';
/**
 * @param {class} Validations
 */
class Validations {
  /**
   * @author: Mwibutsa Floribert
   * @param {Object} schemaName
   * @param {Object} options
   * @param {function} next
   * @returns {middleware}-- Middleware
   */
  static validate(schemaName, options) {
    return async (req, res, next) => {
      try {
        await joi.validate(req.body, schemaName, options);
      } catch (error) {
        return res.status(400).json({ error: error.details });
      }
      next();
    };
  }
}
export default Validations;
