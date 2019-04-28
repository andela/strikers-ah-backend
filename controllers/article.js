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
   * @returns {Object} Add Article Comments
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
        userid: req.user,
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

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get Article Comments
   */
  static async getComments(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return res.status(404).json({ message: 'Article not found' });
    }
    try {
      const comment = await ArticleCommentModel.listComments(articleDetails.id);
      const comments = [];
      await (comment.map(async (entry) => {
        const author = select.pick(entry, ['username', 'bio', 'image']);
        entry = select.pick(entry, ['id', 'comment', 'createdAt', 'updatedAt']);
        entry.author = author;
        comments.push(entry);
      }));

      return res.status(201).json({ comment: comments, commentsCount: comments.length });
    } catch (error) { return res.status(400).json({ error: error.errors[0].message }); }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Add Article Comments
   */
  static async updateComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const { commentid } = req.params;
    const articleId = articleDetails.id;
    let articleCommentDetails = await ArticleCommentModel.singleComment(articleId, commentid);
    if (!articleCommentDetails) {
      return res.status(404).json({ message: 'Article comment not found' });
    }
    if (!req.body.comment.body.trim()) {
      return res.status(400).json({ message: 'Provide comment' });
    }
    [articleCommentDetails] = articleCommentDetails;
    if (articleCommentDetails.userid !== req.user) {
      return res.status(400).json({ message: 'You are not comment author' });
    }
    const commentBody = req.body.comment.body.trim();
    const { id } = articleCommentDetails;
    try {
      let comment = await ArticleCommentModel.update(
        { comment: commentBody },
        { where: { id }, returning: true }
      );
      [, [comment]] = comment;
      const author = await userModel.findOne({ attributes: ['id', 'username', 'bio', 'image'], where: { id: req.user } });
      comment = select.pick(comment, ['id', 'comment', 'createdAt', 'updatedAt']);
      comment.author = author;
      return res.status(201).json({ comment });
    } catch (error) { return res.status(400).json({ error: error.errors[0].message }); }
  }
}
export default Article;
