import Sequelize from 'sequelize';
import model from '../models/index';

const { article: articleModel, user: UserModel } = model;

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
    const { keyword } = req.query;
    const { Op } = Sequelize;
    const searchArticle = await articleModel.findAll({
      attributes: { exclude: ['id', 'provider', 'provideruserid', 'password', 'createdAt', 'updatedAt'] },
      where: {
        [Op.or]: {
          title: { [Op.like]: `%${keyword}%` }, slug: { [Op.like]: `%${keyword}%` }, body: { [Op.like]: `%${keyword}%` }, description: { [Op.like]: `%${keyword}%` },
        }
      }
    });
    const searchUser = await UserModel.findAll({
      attributes: { exclude: ['id', 'provider', 'provideruserid', 'password', 'createdAt', 'updatedAt'] },
      where: {
        [Op.or]: {
          firstname: { [Op.like]: `%${keyword}%` }, lastname: { [Op.like]: `%${keyword}%` }, email: { [Op.like]: `%${keyword}%` }, username: { [Op.like]: `%${keyword}%` }, bio: { [Op.like]: `%${keyword}%` }
        }
      }
    });
    return res.status(200).json({ searchArticle, searchUser });
  }
}

export default Search;
