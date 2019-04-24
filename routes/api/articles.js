import express from 'express';
import articleController from '../../controllers/article';
import AuthToken from '../../middlewares/tokenValidation';
import errorHandler from '../../middlewares/errorHandler';
import Strategy from '../../middlewares/auth';
import helper from '../../helpers/helper';

const router = express.Router();

router.get('/all', errorHandler(articleController.getAllArticles));
router.post('/', AuthToken, errorHandler(articleController.createArticle));
router.get('/:slug', errorHandler(articleController.getArticle));
router.delete('/:slug', AuthToken, errorHandler(articleController.deleteArticle));
router.put('/:slug', AuthToken, errorHandler(articleController.updateArticle));
router.post('/:slug/bookmark', AuthToken, errorHandler(articleController.bookmarkArticle));
router.get('/', errorHandler(articleController.articlePagination));
router.post('/:slug/rate/:rate', AuthToken, articleController.rateArticle);
router.get('/:slug/rates', AuthToken, articleController.fetchArticleRating);
router.post('/', articleController.createArticle);
router.get('/');
router.delete('/:slug');
router.put('/:slug');
router.patch(
  '/:slug/:likeState',
  Strategy.verifyToken,
  helper.asyncHandler(articleController.likeArticle)
);

export default router;
