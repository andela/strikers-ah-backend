// import debug from 'debug';
import select from 'lodash';
import models from '../models';
import Slug from '../helpers/slug';
import Description from '../helpers/makeDescription';
import ArticleEvents from '../helpers/articleEvents';
import enumRate from '../helpers/enumeration';
import objKey from '../helpers/enumKeyFinder';
import helper from '../helpers/helper';

const notify = new ArticleEvents();

notify.on('create', args => notify.create(args));

const {
  article: ArticleModel,
  rating: ratingModel,
  user: UserModel,
  bookmark: bookmarkModel,
  ArticleLikesAndDislikes,
  articlecomment: ArticleCommentModel
} = models;

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
      title, body, taglist, description
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title can not be null' });
    }
    if (!body) {
      return res.status(400).json({ error: 'body can not be null' });
    }
    const authorid = req.user;
    const checkuser = await UserModel.checkuser(authorid);
    if (!checkuser) {
      return res.status(404).json({
        error: 'Please register'
      });
    }
    const slugInstance = new Slug(title);
    const descriptionInstance = new Description(description, body);
    const descriptData = descriptionInstance.makeDescription();
    const slug = slugInstance.returnSlug();
    const newArticle = {
      title,
      body,
      description: descriptData,
      slug,
      authorid,
      taglist
    };
    const article = await ArticleModel.createArticle(newArticle);
    notify.emit('create', newArticle);
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

  /**
   * @author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} updted Article
   */
  static async updateArticle(req, res) {
    const { slug } = req.params;
    const {
      title, body, taglist, description
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title can not be null' });
    }
    if (!body) {
      return res.status(400).json({ error: 'body can not be null' });
    }
    const authorid = req.user;
    const searchArticle = await ArticleModel.findArticleSlug(authorid, slug);
    if (!searchArticle) {
      res.status(404).json({
        error: 'No article found for you to edit'
      });
    } else {
      const { id } = searchArticle;
      const slugInstance = new Slug(title);
      const descripInstance = new Description(description, body);
      const descriptData = descripInstance.makeDescription();
      const newSlug = slugInstance.returnSlug();
      const updatedArticle = {
        title,
        body,
        description: descriptData,
        slug: newSlug,
        authorid,
        taglist
      };
      const updateArticle = await ArticleModel.updateFoundArticle(id, updatedArticle);
      res.status(200).json({
        message: 'Article updated',
        article: updateArticle
      });
    }
  }

  /**
   *@author: Innocent Nkunzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return a bookmarked article
   */
  static async bookmarkArticle(req, res) {
    const { slug } = req.params;
    const userid = req.user;
    const checkSlug = await ArticleModel.getOneArticle(slug);
    if (!checkSlug) {
      return res.status(404).json({
        error: 'No article found with the specified slug'
      });
    }
    const articleId = checkSlug.id;
    const checkBookmark = await bookmarkModel.checkuser(userid, articleId);
    if (!checkBookmark) {
      const bookmark = await bookmarkModel.bookmark(userid, articleId);
      res.status(201).json({
        message: 'Bookmarked',
        article: bookmark
      });
    } else {
      res.status(403).json({
        error: 'Already bookmarked'
      });
    }
  }

  /**
   *
   * @author Innocent Nkunzi
   * @param {*} req
   * @param {*} res
   * @returns {object} it returns an object of articles
   */
  static async articlePagination(req, res) {
    const pageNumber = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    if (pageNumber <= 0) {
      return res.status(403).json({
        error: 'Invalid page number'
      });
    }
    if (limit <= 0) {
      return res.status(403).json({
        error: 'Invalid page limit'
      });
    }
    const offset = limit * (pageNumber - 1);
    const getAll = await ArticleModel.getAll(limit, offset);
    if (getAll.length) {
      res.status(200).json({
        article: getAll,
        articlesCount: getAll.length
      });
    } else {
      res.status(404).json({
        error: 'No article found for now'
      });
    }
  }

  /**
   *@author: Clet Mwunguzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Rate
   */
  static async rateArticle(req, res) {
    const { rate, slug } = req.params;
    const rating = enumRate[`${rate}`];
    const userId = req.user;

    const user = await UserModel.findUser(userId);
    if (!user) {
      return res.status(404).send({
        status: 404,
        error: 'User not found'
      });
    }
    const { id, username } = user.dataValues;

    if (typeof rating === 'undefined') {
      return res.status(400).send({
        status: 400,
        error: 'invalid rating'
      });
    }

    if (Number(slug)) {
      return res.status(400).send({
        status: 400,
        error: 'slug of an article can not be a number.'
      });
    }

    const results = await ArticleModel.verifyArticle(slug);
    if (!results) {
      return res.status(404).send({
        status: 404,
        error: 'Article can not be found.'
      });
    }
    const { title: articleTitle } = results.dataValues;

    const rateChecking = await ratingModel.addRate(rating, slug, userId);
    const [dataResult, returnValue] = rateChecking;

    if (returnValue) {
      return res.status(201).send({
        rated_article: {
          status: 201,
          id: dataResult.dataValues.id,
          user: {
            id,
            username
          },
          article: {
            title: articleTitle,
            slug: dataResult.dataValues.articleSlug
          },
          rating: rate
        }
      });
    }

    if (!returnValue && dataResult.dataValues.rating !== rating) {
      const updateRate = await ratingModel.rateUpdate(rateChecking[0].dataValues.id, rating);
      const { userId: userid } = updateRate[1][0].dataValues;
      return res.status(200).send({
        rated_article: {
          status: 200,
          id: updateRate[1][0].dataValues.id,
          user: {
            id: userid,
            username
          },
          article: {
            title: articleTitle,
            slug: updateRate[1][0].dataValues.articleSlug
          },
          rating: rate,
          previousRating: objKey(dataResult.dataValues.rating)
        }
      });
    }
    return res.status(403).send({
      status: 403,
      error: 'Article can only be rated once.'
    });
  }

  /**
   *@author: Clet Mwunguzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Rate
   */
  static async fetchArticleRating(req, res) {
    const { slug } = req.params;

    if (Number(slug)) {
      return res.status(400).send({
        status: 400,
        error: 'slug of an article can not be a number.'
      });
    }

    const results = await ArticleModel.verifyArticle(slug);
    if (!results) {
      return res.status(404).send({
        status: 404,
        error: 'Article can not be found.'
      });
    }
    const { title, slug: articleSlug } = results.dataValues;
    const allArticles = await ratingModel.allRatings(UserModel, ArticleModel, slug);
    const { count, rows } = allArticles;

    if (rows.length === 0) {
      return res.status(404).send({
        status: 404,
        error: 'No rating found for this article'
      });
    }
    return res.status(200).send({
      status: 200,
      article: {
        title,
        slug: articleSlug
      },
      who_rated: rows,
      UsersCount: count
    });
  }

  /**
   * @author Mwibutsa Floribert
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} -
   */
  static async likeArticle(req, res) {
    const { slug, likeState } = req.params;
    if (`${likeState}` !== 'like' && `${likeState}` !== 'dislike') {
      return res.status(404).json({ error: 'Page not found' });
    }
    const { id: userId } = helper.decodeToken(req);

    // check if the article exists
    const article = await ArticleModel.findOne({ where: { slug } });
    if (article) {
      await ArticleLikesAndDislikes.saveLike(
        { user_id: userId, article_id: article.id },
        `${likeState}`
      );
      // get article likes count
      const { count: likes } = await ArticleLikesAndDislikes.findAndCountAll({
        where: { article_id: article.id, like_value: 'like' }
      });
      // get article dislikes count
      const { count: dislikes } = await ArticleLikesAndDislikes.findAndCountAll({
        where: { article_id: article.id, like_value: 'dislike' }
      });
      res.status(201).json({ article: helper.combineWithArticle(article, { likes, dislikes }) });
    }
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
      const author = await UserModel.findOne({ attributes: ['id', 'username', 'bio', 'image'], where: { id: newComment.userid } });
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
