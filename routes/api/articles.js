import express from 'express';
import articleController from '../../controllers/article';
import AuthToken from '../../middlewares/tokenValidation';
import articleCommentController from '../../controllers/articlecomment';
import errorHandler from '../../middlewares/errorHandler';
import Strategy from '../../middlewares/auth';
import helper from '../../helpers/helper';

const router = express.Router();

router.get('/all', errorHandler(articleController.getAllArticles));
router.get('/:slug', errorHandler(articleController.getArticle));
router.get('/', errorHandler(articleController.articlePagination));
router.post('/:slug/bookmark', AuthToken, errorHandler(articleController.bookmarkArticle));
router.post('/:slug/rate/:rate', AuthToken, articleController.rateArticle);
router.get('/:slug/rates', AuthToken, articleController.fetchArticleRating);
router.post('/', AuthToken, errorHandler(articleController.createArticle));
router.delete('/:slug', AuthToken, errorHandler(articleController.deleteArticle));
router.put('/:slug', AuthToken, errorHandler(articleController.updateArticle));
router.patch(
  '/:slug/:likeState',
  Strategy.verifyToken,
  helper.asyncHandler(articleController.likeArticle)
);
router.post('/:slug/comments', AuthToken, articleController.addComment);
router.get('/:slug/comments', AuthToken, articleController.getComments);
router.put('/:slug/comments/:commentid', AuthToken, articleController.updateComment);
router.delete('/:slug/comments/:commentid', AuthToken, articleCommentController.deleteComment);
router.post('/:slug/rate/:rate', AuthToken, articleController.rateArticle);
router.post('/:slug/comments/:commentid/like', AuthToken, articleCommentController.likeComment);
router.post('/:slug/rate/:rate', AuthToken, articleController.rateArticle);
router.get('/:slug/comments/popular', AuthToken, (req, res, next) => { req.commenttype = 'popular'; next(); }, articleCommentController.getComments);


export default router;
