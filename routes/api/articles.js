import express from 'express';
import articleController from '../../controllers/article';
import AuthToken from '../../middlewares/tokenValidation';
import articleCommentController from '../../controllers/articlecomment';
import errorHandler from '../../middlewares/errorHandler';
import Strategy from '../../middlewares/auth';
import helper from '../../helpers/helper';
import imageUpload from '../../middlewares/imageUpload';

const router = express.Router();

router.get('/all', errorHandler(articleController.getAllArticles));
router.get(
  '/reports',
  AuthToken,
  errorHandler(articleController.getReportedArticle)
);
router.get('/latest', articleController.fetchLatestArticles);
router.get(
  '/user-articles/:username',
  helper.asyncHandler(articleController.getUserArticles)
);
router.post(
  '/',
  AuthToken,
  imageUpload,
  errorHandler(articleController.createArticle)
);
router.post(
  '/:slug/highlight',
  AuthToken,
  helper.asyncHandler(articleController.addHighlightComment)
);
router.get(
  '/:slug/highlight',
  AuthToken,
  helper.asyncHandler(articleController.getHighlightComments)
);
router.delete(
  '/:slug/highlight/:id',
  AuthToken,
  helper.asyncHandler(articleController.deleteHighlightComments)
);
router.get(
  '/bookmarked',
  AuthToken,
  helper.asyncHandler(articleController.getBookmarkedArticles)
);
router.get('/:slug', AuthToken, errorHandler(articleController.getArticle));
router.get('/', errorHandler(articleController.articlePagination));
router.post(
  '/:slug/bookmark',
  AuthToken,
  errorHandler(articleController.bookmarkArticle)
);
router.post('/:slug/rate/:rate', AuthToken, articleController.rateArticle);
router.get('/:slug/rates', AuthToken, articleController.fetchArticleRating);
router.delete(
  '/:slug',
  AuthToken,
  errorHandler(articleController.deleteArticle)
);
router.put(
  '/:slug',
  AuthToken,
  imageUpload,
  errorHandler(articleController.updateArticle)
);
router.get(
  '/rating/articles',
  errorHandler(articleController.articleRatingPagination)
);
router.patch(
  '/:slug/:likeState',
  Strategy.verifyToken,
  helper.asyncHandler(articleController.likeArticle)
);
router.post('/:slug/comments', AuthToken, articleCommentController.addComment);
router.get('/:slug/comments', AuthToken, articleCommentController.getComments);
router.put(
  '/:slug/comments/:commentid',
  AuthToken,
  articleCommentController.updateComment
);
router.delete(
  '/:slug/comments/:commentid',
  AuthToken,
  articleCommentController.deleteComment
);
router.post(
  '/:slug/comments/:commentid/like',
  AuthToken,
  articleCommentController.likeComment
);
router.get(
  '/:slug/comments/popular',
  AuthToken,
  (req, res, next) => {
    req.commenttype = 'popular';
    next();
  },
  articleCommentController.getComments
);
router.get(
  '/:slug/comments/:commentid/history',
  AuthToken,
  articleCommentController.commentEditHistory
);
router.get('/:slug/stats', AuthToken, articleController.getReadingStats);
router.post(
  '/report/category',
  AuthToken,
  articleController.AddReportingCategory
);
router.get(
  '/report/category',
  AuthToken,
  articleController.reportingCategories
);
router.put(
  '/report/category/:id',
  AuthToken,
  articleController.editReportingCategory
);
router.delete(
  '/report/category/:id',
  AuthToken,
  articleController.deleteReportingCategory
);
router.post('/:slug/report/', AuthToken, articleController.reportingArticle);
router.get('/:slug/ratings', articleController.fetchAvgRating);
router.get(
  '/category/:category',
  AuthToken,
  articleController.getArticlesByCategory
);

export default router;
