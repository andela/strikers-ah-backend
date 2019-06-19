/* eslint-disable max-len */
// import debug from 'debug';
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
  articlereadingstats: ArticleReadingStats,
  reportingcategory: articleReportingCategory,
  articlereporting: articleReporting,
  articlehighlightcomment: articleHighLightComments,
  articlecategory: ArticleCategoryModel
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
    let { category } = req.body;
    if (!category || category === '') {
      category = 0;
    } else {
      const categoryExists = await ArticleCategoryModel.findOne({
        where: { id: category }
      });
      if (!categoryExists) {
        return helper.jsonResponse(res, 404, { error: 'Category not found' });
      }
    }
    const image = req.file ? req.file.url : 'null';

    if (!title) {
      return res.status(400).json({ error: 'title can not be empty' });
    }
    if (!body) {
      return res.status(400).json({ error: 'body can not be empty' });
    }
    const authorid = req.user;
    const checkuser = await UserModel.checkuserExistance(authorid);
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
      taglist,
      image,
      category
    };
    const article = await ArticleModel.createArticle(newArticle);
    let categoryName = 'Other';
    const getCategory = await ArticleCategoryModel.findOne({
      where: { id: article.category }
    });
    if (getCategory) {
      categoryName = getCategory.name;
    }
    notify.emit('create', newArticle);
    return res.status(201).json({
      article: {
        id: article.id,
        title: article.title,
        body: article.body,
        description: article.description,
        slug: article.slug,
        author: checkuser,
        taglist: article.taglist,
        image: article.image,
        category: categoryName,
        updatedAt: article.updatedAt,
        createdAt: article.createdAt
      }
    });
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
    let article = await ArticleModel.getOneArticle(slug);
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
      let categoryName = 'Other';
      const getCategory = await ArticleCategoryModel.findOne({
        where: { id: article.category }
      });
      if (getCategory) {
        categoryName = getCategory.name;
      }
      article.category = categoryName;
      const bookmarked = await bookmarkModel.checkuser(req.user, articleid);
      const isBookmarked = !!bookmarked;
      const { username } = await UserModel.findOne({
        attributes: ['username'],
        where: { id: article.authorid }
      });
      article = { ...article.dataValues, bookmark: isBookmarked, username };
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
    const getAll = await ArticleModel.getAll(UserModel);
    if (getAll.length === 0) {
      res.status(404).json({
        error: 'Not article found for now'
      });
    } else {
      await Promise.all(
        getAll.map(async (article) => {
          let categoryName = 'Other';
          const getCategory = await ArticleCategoryModel.findOne({
            where: { id: article.category }
          });
          if (getCategory) {
            categoryName = getCategory.name;
          }
          article.category = categoryName;
          return article;
        })
      );
      //
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
      return res
        .status(404)
        .json({ error: 'No article found for you to delete' });
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
    let { category } = req.body;
    if (!category || category === '') {
      category = 0;
    } else {
      const categoryExists = await ArticleCategoryModel.findOne({
        where: { id: category }
      });
      if (!categoryExists) {
        return helper.jsonResponse(res, 404, { error: 'Category not found' });
      }
    }
    const image = req.file ? req.file.url : 'null';
    const authorid = req.user;
    const searchArticle = await ArticleModel.findArticleSlug(authorid, slug);
    if (!searchArticle) {
      return res.status(404).json({
        error: 'No article found for you to edit'
      });
    }
    const slugInstance = new Slug(title);
    const newSlug = slugInstance.returnSlug();
    const { id } = searchArticle;
    const updatedArticle = {
      title: title.length !== 0 ? title : searchArticle.title,
      body: body.length !== 0 ? body : searchArticle.body,
      description: description || searchArticle.description,
      slug: newSlug.length === 8 ? searchArticle.slug : newSlug,
      authorid,
      taglist: taglist.length !== 0 ? taglist : searchArticle.taglist,
      image,
      category
    };
    const updateArticle = await ArticleModel.updateFoundArticle(
      id,
      updatedArticle
    );
    let categoryName = 'Other';
    const getCategory = await ArticleCategoryModel.findOne({
      where: { id: updatedArticle.category }
    });
    if (getCategory) {
      categoryName = getCategory.name;
    }
    updateArticle.category = categoryName;
    res.status(200).json({
      message: 'Article updated',
      article: updateArticle
    });
  }

  /**
   * @author Mwibutsa Floribert and Jacques Nyilinkindi
   * @param {*} req
   * @param {*} res
   * @returns { object } --
   */
  static async addHighlightComment(req, res) {
    const { slug } = req.params;
    const { user: userId } = req;
    const {
      comment, text, positionleft, positiontop
    } = req.body;

    const article = await ArticleModel.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }
    try {
      const newHighlightComment = {
        userid: userId,
        articleid: article.id,
        comment,
        text,
        positionleft,
        positiontop
      };
      await articleHighLightComments.create(newHighlightComment);
      return res.status(201).json({ highlight: newHighlightComment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   * @author Mwibutsa Floribert and Jacques Nyilinkindi
   * @param {*} req
   * @param {*} res
   * @returns { * } --
   */
  static async getHighlightComments(req, res) {
    const { slug } = req.params;
    const { user: userId } = req;
    const article = await ArticleModel.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }
    const comments = await articleHighLightComments.findAll({
      where: { articleid: article.id, userid: userId }
    });
    return res.status(200).json(comments);
  }

  /**
   * @author Jacques Nyilinkindi
   * @param {*} req
   * @param {*} res
   * @returns { * } --
   */
  static async deleteHighlightComments(req, res) {
    const { slug, id } = req.params;
    const { user: userid } = req;
    const article = await ArticleModel.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }
    const articleHighlight = await articleHighLightComments.findOne({
      where: { articleid: article.id, userid, id }
    });
    if (!articleHighlight) {
      return res.status(404).json({
        error: 'Article highlight not found'
      });
    }
    await articleHighLightComments.destroy({
      where: { id }
    });
    return res.status(200).json({ message: 'Highlight deleted' });
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
      await bookmarkModel.destroy({ where: { userid, articleid: articleId } });
      res.status(201).json({
        message: 'Unbookmarked'
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
    const getAll = await ArticleModel.getAllPages(limit, offset);
    await Promise.all(
      getAll.map(async (article) => {
        let categoryName = 'Other';
        const getCategory = await ArticleCategoryModel.findOne({
          where: { id: article.category }
        });
        if (getCategory) {
          categoryName = getCategory.name;
        }
        article.category = categoryName;
        return article;
      })
    );
    //
    if (getAll) {
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

    const results = await ArticleModel.getOneArticle(slug);
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
      const updateRate = await ratingModel.rateUpdate(
        rateChecking[0].dataValues.id,
        rating
      );
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

    const results = await ArticleModel.getOneArticle(slug);
    if (!results) {
      return res.status(404).send({
        status: 404,
        error: 'Article can not be found.'
      });
    }
    const { title, slug: articleSlug } = results.dataValues;
    const allArticles = await ratingModel.allRatings(
      UserModel,
      ArticleModel,
      slug
    );
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
      const { count: dislikes } = await ArticleLikesAndDislikes.findAndCountAll(
        {
          where: { article_id: article.id, like_value: 'dislike' }
        }
      );
      res.status(201).json({
        article: helper.combineWithArticle(article, { likes, dislikes })
      });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get Article readers
   */
  static async getReadingStats(req, res) {
    if (!req.params.slug) {
      return helper.jsonResponse(res, 400, { message: 'Provide article slug' });
    }
    const { slug } = req.params;
    const articleDetails = await ArticleModel.findOne({ where: { slug } });
    if (!articleDetails) {
      return helper.jsonResponse(res, 404, { message: 'Article not found' });
    }
    try {
      let stats = await ArticleReadingStats.readingStats(
        'article',
        articleDetails.id
      );
      let statsCount = stats.length;
      if (!stats || stats.length === 0) {
        stats = 'Articles not read ';
        statsCount = 0;
      }
      return helper.jsonResponse(res, 200, { stats, statsCount });
    } catch (error) {
      return helper.jsonResponse(res, 400, { error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Add reporting category
   */
  static async AddReportingCategory(req, res) {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Provide category name' });
    }
    try {
      const [
        categoryInfo,
        created
      ] = await articleReportingCategory.findOrCreate({
        where: { name: category }
      });
      if (created) {
        return res.status(201).json({ category: categoryInfo });
      }
      return res.status(409).json({ message: 'Category already exists' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} View reporting categories
   */
  static async reportingCategories(req, res) {
    try {
      const categories = await articleReportingCategory.findAll({
        attributes: ['id', 'name']
      });
      if (categories) {
        return res.status(200).json({ categories });
      }
      return res.status(404).json({ message: 'No category found' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Edit reporting category
   */
  static async editReportingCategory(req, res) {
    const { id } = req.params;
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Provide new category name' });
    }
    const findCategory = await articleReportingCategory.findOne({
      where: { name: category }
    });
    if (findCategory) {
      return res
        .status(409)
        .json({ message: 'Category with same name exists' });
    }
    try {
      let reportingCategory = await articleReportingCategory.update(
        { name: category },
        { where: { id }, returning: true }
      );
      [, [reportingCategory]] = reportingCategory;
      if (!reportingCategory) {
        return res.status(200).json({ message: 'Category not found' });
      }
      return res.status(200).json({ category: reportingCategory });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Delete reporting category
   */
  static async deleteReportingCategory(req, res) {
    const { id } = req.params;
    try {
      await articleReportingCategory.destroy({ where: { id } });
      return res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Reporting an article
   */
  static async reportingArticle(req, res) {
    const articleDetails = await ArticleModel.findOne({
      where: { slug: req.params.slug }
    });
    if (!articleDetails) {
      return res.status(404).json({ message: 'Article not found' });
    }
    if (!req.body.category) {
      return res.status(400).json({ message: 'Provide reporting category' });
    }
    const category = await articleReportingCategory.findOne({
      where: { name: req.body.category }
    });
    if (!category) {
      return res.status(404).json({ message: 'Reporting category not found' });
    }
    try {
      const report = {
        articleid: articleDetails.id,
        categoryid: category.id,
        userid: req.user,
        description: req.body.description || ''
      };
      const reported = await articleReporting.create(report);
      const response = {
        id: reported.id,
        category: req.body.category,
        description: report.description,
        article: {
          id: articleDetails.id,
          slug: req.params.slug,
          title: articleDetails.title
        }
      };
      return res.status(201).json({ report: response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Jacques Nyilinkindi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Get reported articles
   */
  static async getReportedArticle(req, res) {
    try {
      const reported = await articleReporting.reportedArticles();
      if (!reported) {
        return res.status(404).json({ message: 'No reported article found!' });
      }
      const response = reported.map(
        ({
          id, description, name, articleid, title, slug
        }) => ({
          id,
          category: name,
          description,
          article: {
            id: articleid,
            slug,
            title
          }
        })
      );
      return res.status(200).json({ report: response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
   *@author: Clet Mwunguzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} it returns avg rating
   */
  static async fetchAvgRating(req, res) {
    const { slug } = req.params;
    if (Number(slug)) {
      return res.status(400).send({
        status: 400,
        error: 'slug of an article can not be a number.'
      });
    }

    const results = await ArticleModel.getOneArticle(slug);
    if (!results) {
      return res.status(404).send({
        status: 404,
        error: 'Article can not be found.'
      });
    }
    const allArticles = await ratingModel.allRatings(
      UserModel,
      ArticleModel,
      slug
    );
    const { rows } = allArticles;
    if (rows.length === 0) {
      return res.status(404).send({
        status: 404,
        error: 'No rating. Be first to rate'
      });
    }

    const avgRating = await ratingModel.avgFind(
      slug,
      ArticleModel,
      ratingModel
    );
    const {
      articleSlug: aSlug,
      avgRating: AvgRate,
      article
    } = avgRating[0].dataValues;
    const { title } = article.dataValues;

    return res.status(200).send({
      status: 200,
      article: {
        title,
        slug: aSlug
      },
      averageRating: objKey(Math.ceil(AvgRate))
    });
  }

  /**
   * @author Innocent Nkunzi
   * @param {*} req
   * @param {*} res
   * @returns {object} it returns an object of articles
   */
  static async articleRatingPagination(req, res) {
    const pageNumber = parseInt(req.query.page, 10);
    const limitRatings = parseInt(req.query.limit, 10);

    if (pageNumber <= 0) {
      return res.status(403).json({
        error: 'Invalid page number'
      });
    }
    if (limitRatings <= 0) {
      return res.status(403).json({
        error: 'Invalid limit'
      });
    }
    const offset = limitRatings * (pageNumber - 1);
    const listOfRatings = await ratingModel.paginateArticleRatings(
      limitRatings,
      offset
    );
    if (listOfRatings.length) {
      res.status(200).json({
        articles: listOfRatings,
        ratingCounts: listOfRatings.length
      });
    } else {
      res.status(404).json({ error: 'No article found' });
    }
  }

  /**
   * @author Mwibutsa Floribert
   * @param {*} req
   * @param {*} res
   * @returns {*} ---
   */
  static async getBookmarkedArticles(req, res) {
    const { user: userId } = req;
    const bookmarked = await bookmarkModel.findAll({
      where: { userid: userId },
      include: [
        {
          model: UserModel,
          attributes: {
            exclude: ['password']
          }
        },
        {
          model: ArticleModel
        }
      ]
    });
    if (bookmarked) {
      await Promise.all(
        bookmarked.map(async (article) => {
          let categoryName = 'Other';
          const getCategory = await ArticleCategoryModel.findOne({
            where: { id: article.article.category }
          });
          if (getCategory) {
            categoryName = getCategory.name;
          }
          article.article.category = categoryName;
          return article;
        })
      );
      //
      res.status(200).json({ status: 200, bookmarkedArticles: bookmarked });
    } else {
      res.status(404).json({
        satus: 404,
        error: 'no bookmarked articles were found for you'
      });
    }
  }

  /**
   *@author: Clet Mwunguzi
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Latest articles
   */
  static async fetchLatestArticles(req, res) {
    const result = await ArticleModel.fetchLatest(UserModel);
    if (result) {
      await Promise.all(
        result.map(async (article) => {
          let categoryName = 'Other';
          const getCategory = await ArticleCategoryModel.findOne({
            where: { id: article.category }
          });
          if (getCategory) {
            categoryName = getCategory.name;
          }
          article.category = categoryName;
          return article;
        })
      );
      //
      return res.status(200).send({
        status: 200,
        data: result
      });
    }
    return res.status(200).send({
      status: 200,
      message: 'There are no latest articles'
    });
  }

  /**
   *@author Mwibutsa Floribert
   * @param {*} req
   * @param {*} res
   * @returns { * } --
   */
  static async getUserArticles(req, res) {
    const profile = await UserModel.findOne({
      where: { username: req.params.username }
    });
    if (profile) {
      const userArticles = await ArticleModel.findAll({
        where: { authorid: profile.id }
      });
      await Promise.all(
        userArticles.map(async (article) => {
          let categoryName = 'Other';
          const getCategory = await ArticleCategoryModel.findOne({
            where: { id: article.category }
          });
          if (getCategory) {
            categoryName = getCategory.name;
          }
          article.category = categoryName;
          return article;
        })
      );
      //
      res.status(200).json({
        status: 200,
        articles: userArticles
      });
    } else {
      res.status(404).json({
        status: 404,
        error: `No articles were found for ${req.params.username}`
      });
    }
  }

  /**
   * @author Jacques Nyilinkindi
   * @param {*} req
   * @param {*} res
   * @returns {object} it returns an object of articles
   */
  static async getArticlesByCategory(req, res) {
    const { category: name } = req.params;
    if (!name || name === '' || name.trim() === '') {
      return helper.jsonResponse(res, 400, { error: 'Provide Category Name' });
    }
    let categoryId = 0;
    if (name !== 'Other') {
      const categoryExists = await ArticleCategoryModel.findOne({
        where: { name }
      });
      if (!categoryExists) {
        return helper.jsonResponse(res, 404, { error: 'Category not found' });
      }
      categoryId = categoryExists.id;
    }
    const getAll = await ArticleModel.findAll({ where: { category: categoryId } });
    if (!getAll) {
      res.status(404).json({
        error: 'Not article found for now'
      });
    } else {
      await Promise.all(
        getAll.map(async (article) => {
          let categoryName = 'Other';
          const getCategory = await ArticleCategoryModel.findOne({
            where: { id: article.category }
          });
          if (getCategory) {
            categoryName = getCategory.name;
          }
          article.category = categoryName;
          return article;
        })
      );
      //
      res.status(200).json({
        article: getAll
      });
    }
  }
}
export default Article;
