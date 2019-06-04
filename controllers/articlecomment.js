import select from 'lodash';
import models from '../models';
import helper from '../helpers/helper';

const { article: ArticleModel, articlecomment: ArticleCommentModel, user: userModel } = models;
const { articlecommentliker: ArticleCommentLiker, commenthistory: CommentHistoryModel } = models;

/**
 * @description  CRUD for article Class
 */
class ArticleComment {
  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Add Article Comments
   */
  static async addComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    if (!req.body.comment.body.trim()) {
      return helper.jsonResponse(res, 400, { message: 'Provide comment' });
    }
    const commentBody = req.body.comment.body.trim();
    const { id: articleid } = articleDetails;
    try {
      const newComment = {
        userid: req.user,
        articleid,
        comment: commentBody,
      };
      let comment = await ArticleCommentModel.create(newComment);
      const author = await userModel.findOne({
        attributes: ['id', 'username', 'bio', 'image'],
        where: { id: newComment.userid },
      });
      comment = select.pick(comment, ['id', 'comment', 'likes', 'createdAt', 'updatedAt']);
      comment.author = author;
      return helper.jsonResponse(res, 201, { comment });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
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
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    try {
      const type = req.commenttype && req.commenttype === 'popular' ? 'popular' : 'all';
      const comment = await ArticleCommentModel.listComments(articleDetails.id, type);
      const comments = [];
      await comment.map(async (entry) => {
        const author = select.pick(entry, ['username', 'bio', 'image']);
        entry = select.pick(entry, ['id', 'comment', 'likes', 'createdAt', 'updatedAt']);
        entry.author = author;
        comments.push(entry);
      });

      return helper.jsonResponse(res, 200, { comment: comments, commentsCount: comments.length });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Update Article Comments
   */
  static async updateComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    const { commentid } = req.params;
    const articleId = articleDetails.id;
    let articleCommentDetails = await ArticleCommentModel.singleComment(articleId, commentid);
    if (!articleCommentDetails[0]) {
      return helper.jsonResponse(res, 404, { message: 'Article comment not found' });
    }
    if (!req.body.comment.body.trim()) {
      return helper.jsonResponse(res, 400, { message: 'Provide comment' });
    }
    [articleCommentDetails] = articleCommentDetails;
    if (articleCommentDetails.userid !== req.user) {
      return helper.jsonResponse(res, 400, { message: 'You are not comment author' });
    }
    const commentBody = req.body.comment.body.trim();
    try {
      let comment = await ArticleCommentModel.update(
        { comment: commentBody },
        { where: { id: commentid }, returning: true }
      );
      [, [comment]] = comment;
      const author = await userModel.findOne({
        attributes: ['id', 'username', 'bio', 'image'],
        where: { id: req.user },
      });
      await CommentHistoryModel.create({ commentid, oldcomment: articleCommentDetails.comment });
      comment = select.pick(comment, ['id', 'comment', 'createdAt', 'updatedAt']);
      comment.author = author;
      return helper.jsonResponse(res, 200, { comment });
    } catch (error) {
      helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Delete Article Comments
   */
  static async deleteComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    const { commentid } = req.params;
    const articleId = articleDetails.id;
    let articleCommentDetails = await ArticleCommentModel.singleComment(articleId, commentid);
    if (!articleCommentDetails[0]) {
      return helper.jsonResponse(res, 404, { message: 'Article comment not found' });
    }
    [articleCommentDetails] = articleCommentDetails;
    const commentAuthor = articleCommentDetails.userid;
    const articleAuthor = articleCommentDetails.articleauthor;
    if (commentAuthor === req.user || req.user === articleAuthor) {
      try {
        const { id } = articleCommentDetails;
        await ArticleCommentModel.destroy({ where: { id } });
        return helper.jsonResponse(res, 200, { message: 'Comment deleted' });
      } catch (error) {
        return helper.jsonResponse(res, 400, { error });
      }
    }
    return helper.jsonResponse(res, 400, { message: 'You are not allowed to delete comment' });
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Add Article Comment Like
   */
  static async likeComment(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    const { commentid } = req.params;
    const articleId = articleDetails.id;
    const articleCommentDetails = await ArticleCommentModel.singleComment(articleId, commentid);
    if (!articleCommentDetails[0]) {
      return helper.jsonResponse(res, 404, { message: 'Article comment not found' });
    }
    let message;
    try {
      const like = await ArticleCommentLiker.findOne({ where: { commentid, userid: req.user } });
      if (like) {
        await ArticleCommentModel.decrement('likes', { by: 1, where: { id: commentid } });
        await ArticleCommentLiker.destroy({ where: { commentid, userid: req.user } });
        message = 'Comment unliked';
      } else {
        await ArticleCommentModel.increment('likes', { by: 1, where: { id: commentid } });
        await ArticleCommentLiker.create({ userid: req.user, commentid });
        message = 'Comment liked';
      }
      return helper.jsonResponse(res, 200, { message });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Comment edit history
   */
  static async commentEditHistory(req, res) {
    const articleDetails = await ArticleModel.findOne({ where: { slug: req.params.slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    const { commentid } = req.params;
    const articleId = articleDetails.id;
    const articleCommentDetails = await ArticleCommentModel.singleComment(articleId, commentid);
    if (!articleCommentDetails[0]) {
      return helper.jsonResponse(res, 404, { message: 'Article comment not found' });
    }
    try {
      const commenthistory = await CommentHistoryModel.findAll({ where: { commentid } });
      return helper.jsonResponse(res, 200, { commenthistory, count: commenthistory.length });
    } catch (error) {
      helper.jsonResponse(res, 400, { error });
    }
  }
}
export default ArticleComment;
