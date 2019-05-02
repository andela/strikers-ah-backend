import models from '../models';
import Slug from '../helpers/slug';

const { article: ArticleModel, user: UserModel } = models;
/**
 * @description  CRUD for article Class
 */
class Article {
  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async createArticle(req, res) {
    const {
      title, body, taglist
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title can not be null' });
    } if (!body) {
      return res.status(400).json({ error: 'body can not be null' });
    }
    const authorid = req.user;
    const checkuser = await UserModel.checkuser(authorid);
    if (!checkuser) {
      return res.status(404).json({
        error: 'Please register'
      });
    }
    const slugInstance = new Slug(req.body.title);
    const descriptData = req.body.description || `${req.body.body.substring(0, 100)}...`;
    const slug = slugInstance.returnSlug(title);
    const newArticle = {
      title, body, description: descriptData, slug, authorid, taglist
    };
    const article = await ArticleModel.createArticle(newArticle);
    return res.status(201).json({ article });
  }

  /**
   *
   * @author Innocent Nkunzi
   * @param {object} req
   * @param {object} res
   * @returns {object} returns an object of one article
   */
  static async getArticle(req, res) {
    const { slug } = req.params;
    const article = await ArticleModel.getOneArticle(slug);
    if (!article) {
      res.status(404).json({
        error: 'No article found with the slug provided'
      });
    } else {
      res.status(200).json({ article });
    }
  }

  /**
  * @author Innocent Nkunzi
  * @param {*} req
  * @param {*} res
  * @returns {object} it returns an object of articles
  */
  static async getAllArticles(req, res) {
    const getAll = await ArticleModel.getAll();
    if (getAll.length === 0) {
      res.status(404).json({
        error: 'Not article found for now'
      });
    } else {
      res.status(200).json({
        article: getAll
      });
    }
  }

  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async deleteArticle(req, res) {
    const { slug } = req.params;
    const authorid = req.user;
    const findArticle = await ArticleModel.findArticleSlug(authorid, slug);
    if (!findArticle) {
      return res.status(404).json({ error: 'No article found for you to delete' });
    }
    const articleId = findArticle.id;
    const deleteArticle = await ArticleModel.deleteArticle(articleId);
    if (deleteArticle.length !== 0) {
      res.status(200).json({
        message: 'Article deleted'
      });
    }
  }
}
export default Article;
