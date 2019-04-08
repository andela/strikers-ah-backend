import db from '../models';
import slugify from '../middleware/slugMaker';

const articleModel = db.article;
/**
 * @description  CRUD article Class
 */
class Article extends slugify {
  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async createArticle(req, res) {
    const articleData = req.body;
    const slugMakerInstance = new slugify(articleData.title);
    const slug = `${slugMakerInstance.slugMaker()}-${slugMakerInstance.returnFullyear()
    }${slugMakerInstance.returnDay()}${slugMakerInstance.returnDAte()}${slugMakerInstance.returnHours()}${slugMakerInstance.returnMinute()}`;

    const newArticle = {
      slug,
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      authorid: 1
    };
    try {
      const createArticle = await articleModel.create(newArticle);
      return res.status(201).json({
        message: 'Article created',
        article: createArticle
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

export default Article;
