import Sequelize from 'sequelize';
import debug from 'debug';
import model from '../models/index';

const { article: articleModel, user: UserModel } = model;

const logError = debug('app:*');
/**
 * @author Innocent Nkunzi
 * @description this class perform search for the whole system
 */
class Search {
  /**
   * @author: Innocent Nkunzi
   * @param {*} req character
   * @param {*} res array
   * @returns {*} match
   */
  static async systemSearch(req, res) {
    const { keyword, tag, author } = req.query;
    const { Op } = Sequelize;
    try {
      const searchTag = await articleModel.findAll({
        attributes: { exclude: ['id', 'slug', 'title', 'body', 'authorid', 'views', 'image', 'createdAt', 'updatedAt'] },
        where: {
          taglist: {
            [Op.contains]: [tag],
          },
        },
      });
      const searchAuthor = await UserModel.findAll({
        attributes: { exclude: ['id', 'password', 'provider', 'provideruserid', 'verified', 'inapp_notifications', 'email_notifications', 'role', 'createdAt', 'updatedAt'] },
        where: {
          [Op.or]: {
            firstname: { [Op.like]: `%${author}%` }, lastname: { [Op.like]: `%${author}%` }, username: { [Op.like]: `%${author}%` }, email: { [Op.like]: `%${author}%` }, bio: { [Op.like]: `%${author}%` }, image: { [Op.like]: `%${author}%` },
          },
        },
      });

      const searchArticle = await articleModel.findAll({
        attributes: { exclude: ['id', 'provider', 'provideruserid', 'password', 'createdAt', 'updatedAt'] },
        where: {
          [Op.or]: {
            title: { [Op.like]: `%${keyword}%` }, slug: { [Op.like]: `%${keyword}%` }, body: { [Op.like]: `%${keyword}%` }, description: { [Op.like]: `%${keyword}%` },
          },
        },
      });
      const searchUser = await UserModel.findAll({
        attributes: { exclude: ['id', 'provider', 'provideruserid', 'password', 'createdAt', 'updatedAt'] },
        where: {
          [Op.or]: {
            firstname: { [Op.like]: `%${keyword}%` }, lastname: { [Op.like]: `%${keyword}%` }, email: { [Op.like]: `%${keyword}%` }, username: { [Op.like]: `%${keyword}%` }, bio: { [Op.like]: `%${keyword}%` },
          },
        },
      });
      return res.status(200).json({
        searchArticle, searchUser, searchTag, searchAuthor,
      });
    } catch (error) {
      logError(error);
    }
  }
}

export default Search;
