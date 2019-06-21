import Sequelize from 'sequelize';
import debug from 'debug';
import model from '../models/index';
import helper from '../helpers/helper';

const { createSearchKeyword } = helper;
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
    let { keyword, tag, author } = req.query;
    keyword = createSearchKeyword(keyword);
    tag = tag.split(' ');
    author = createSearchKeyword(author);
    const { Op } = Sequelize;
    try {
      const searchTag = await articleModel.findAll({
        attributes: {
          exclude: ['id', 'authorid']
        },
        where: {
          taglist: {
            [Op.contains]: tag
          }
        }
      });
      const searchAuthor = await UserModel.findAll({
        attributes: {
          exclude: [
            'id',
            'password',
            'provider',
            'provideruserid',
            'verified',
            'inapp_notifications',
            'email_notifications',
            'role',
            'createdAt',
            'updatedAt'
          ]
        },
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: {
                [Op.any]: author
              }
            },
            lastname: {
              [Op.iLike]: {
                [Op.any]: author
              }
            },
            username: {
              [Op.iLike]: {
                [Op.any]: author
              }
            },
            email: {
              [Op.iLike]: {
                [Op.any]: author
              }
            },
            bio: {
              [Op.iLike]: {
                [Op.any]: author
              }
            },
            image: {
              [Op.iLike]: {
                [Op.any]: author
              }
            }
          }
        }
      });

      const searchArticle = await articleModel.findAll({
        include: [
          {
            model: UserModel,
            attributes: {
              exclude: [
                'password',
                'verified',
                'inapp_notifications',
                'email_notifications',
                'provideruserid',
                'provider'
              ]
            }
          }
        ],
        where: {
          [Op.or]: {
            title: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            slug: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            body: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            description: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            }
          }
        }
      });
      const searchUser = await UserModel.findAll({
        attributes: {
          exclude: ['id', 'provider', 'provideruserid', 'password', 'createdAt', 'updatedAt']
        },
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            lastname: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            email: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            username: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            },
            bio: {
              [Op.iLike]: {
                [Op.any]: keyword
              }
            }
          }
        }
      });
      return res.status(200).json({
        searchArticle,
        searchUser,
        searchTag,
        searchAuthor
      });
    } catch (error) {
      logError(error);
    }
  }
}

export default Search;
