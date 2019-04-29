import models from '../models';
import Slug from '../helpers/slug';
import helper from '../helpers/helper';

const { article: ArticleModel, articlereadingstats: ArticleReadingStats } = models;
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
    if (!req.body.title) {
      return res.status(400).json({ error: 'title can not be null' });
    }
    const slugInstance = new Slug(req.body.title);
    const descriptData = req.body.description || `${req.body.body.substring(0, 100)}...`;
    try {
      const {
        title, body, taglist
      } = req.body;
      const slug = slugInstance.returnSlug(title);
      const authorid = req.user;
      const newArticle = {
        title, body, description: descriptData, slug, authorid, taglist
      };
      const article = await ArticleModel.createArticle(newArticle);
      return res.status(201).json({ article });
    } catch (error) { return res.status(400).json({ message: error.errors[0].message }); }
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
    try {
      const article = await ArticleModel.getOneArticle(slug);
      if (!article) {
        res.status(404).json({
          error: 'No article found with the slug provided'
        });
      } else {
        const { id: articleid } = article;
        const [, created] = await ArticleReadingStats.findOrCreate({
          where: { userid: req.user, articleid }
        });
        if (created) {
          await ArticleModel.addViewer(articleid);
        }
        res.status(200).json({ article });
      }
    } catch (err) {
      return res.status(400).json({ message: err.errors[0].message });
    }
  }

  /**
  * @author Innocent Nkunzi
  * @param {*} req
  * @param {*} res
  * @returns {object} it returns an object of articles
  */
  static async getAllArticles(req, res) {
    try {
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
    } catch (err) {
      return res.status(400).json({ message: err.errors[0].message });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get Article readers
   */
  static async getReadingStats(req, res) {
    if (!req.params.slug) { return helper.jsonResponse(res, 400, { message: 'Provide article slug' }); }
    const { slug } = req.params;
    const articleDetails = await ArticleModel.findOne({ where: { slug } });
    if (!articleDetails) { return helper.jsonResponse(res, 404, { message: 'Article not found' }); }
    try {
      let stats = await ArticleReadingStats.readingStats('article', articleDetails.id);
      let statsCount = stats.length;
      if (!stats || stats.length === 0) { stats = 'Articles not read '; statsCount = 0; }
      return helper.jsonResponse(res, 200, { stats, statsCount });
    } catch (error) { return helper.jsonResponse(res, 400, { error }); }
  }
}
export default Article;
