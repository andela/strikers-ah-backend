import { Joi } from 'celebrate';
/**
   *@author: Innocent Nkunzi
   * Function to declare a schema
   */
const createArticleSchemas = Joi.object().keys({
  title: Joi.string().min(5).max(50)
    .required(),
  body: Joi.string().min(50)
    .required(),
  description: Joi.string().min(20).max(100),
});
/**
   * @author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next passes to the next middleware
   * @returns {Object} the error message
   */
function checkArticle(req, res, next) {
  const newArticle = req.body;
  const { error } = Joi.validate(newArticle, createArticleSchemas);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}


export default checkArticle;
