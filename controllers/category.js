import models from '../models';
import helper from '../helpers/helper';

const { articlecategory: ArticleCategoryModel } = models;

/**
 * @description  CRUD For Article Category
 */
class ArticleCategory {
  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Add Article Category
   */
  static async addCategory(req, res) {
    if (req.userRole !== 'Admin') {
      return helper.jsonResponse(res, 401, { message: 'Unauthorized access' });
    }
    const { name } = req.body;
    if (!name || name === '' || name.trim() === '') {
      return helper.jsonResponse(res, 400, { error: 'Provide Category Name' });
    }
    const categoryExists = await ArticleCategoryModel.findOne({ where: { name } });
    if (categoryExists) {
      return helper.jsonResponse(res, 409, { error: 'Category already exist' });
    }
    try {
      await ArticleCategoryModel.create({ name });
      return helper.jsonResponse(res, 201, { message: 'Category saved' });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get All Article Categories
   */
  static async getCategories(req, res) {
    try {
      const categories = await ArticleCategoryModel.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] });
      return helper.jsonResponse(res, 200, { categories, count: categories.length });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Update Article Category
   */
  static async updateCategory(req, res) {
    if (req.userRole !== 'Admin') {
      return helper.jsonResponse(res, 401, { message: 'Unauthorized access' });
    }
    const { name } = req.body;
    if (!name || name === '' || name.trim() === '') {
      return helper.jsonResponse(res, 400, { error: 'Provide Category Name' });
    }
    const { id } = req.params;
    if (!id || id === '') {
      return helper.jsonResponse(res, 400, { error: 'Provide Category' });
    }
    const categoryExists = await ArticleCategoryModel.findOne({ where: { id } });
    if (!categoryExists) {
      return helper.jsonResponse(res, 404, { error: 'Category  not found' });
    }
    try {
      await ArticleCategoryModel.update({ name }, { where: { id } });
      return helper.jsonResponse(res, 201, { message: 'Category updated' });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Delete Article Category
   */
  static async deleteCategory(req, res) {
    if (req.userRole !== 'Admin') {
      return helper.jsonResponse(res, 401, { message: 'Unauthorized access' });
    }
    const { id } = req.params;
    const categoryExists = await ArticleCategoryModel.findOne({ where: { id } });
    if (!categoryExists) {
      return helper.jsonResponse(res, 404, { error: 'Category  not found' });
    }
    try {
      await ArticleCategoryModel.destroy({ where: { id } });
      return helper.jsonResponse(res, 200, { message: 'Category deleted' });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }
}
export default ArticleCategory;
