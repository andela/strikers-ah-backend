import select from 'lodash';
import models from '../models';
import Slug from '../helpers/slug';

const { article: ArticleModel, articlecomment: ArticleCommentModel, user: userModel } = models;
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
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Article
   */
  static async addComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return res.status(404).json({ message: 'Article not found' });
    }
    if (!req.body.comment.body.trim()) {
      return res.status(400).json({ message: 'Provide comment' });
    }
    const commentBody = req.body.comment.body.trim();
    const { id: articleid } = articleDetails;
    try {
      const newComment = {
        userid: req.user.id,
        articleid,
        comment: commentBody
      };
      let comment = await ArticleCommentModel.create(newComment);
      const author = await userModel.findOne({ attributes: ['id', 'username', 'bio', 'image'], where: { id: newComment.userid } });
      comment = select.pick(comment, ['id', 'comment', 'createdAt', 'updatedAt']);
      comment.author = author;
      return res.status(201).json({ comment });
    } catch (error) { return res.status(400).json({ error: error.errors[0].message }); }
  }
}
export default Article;
