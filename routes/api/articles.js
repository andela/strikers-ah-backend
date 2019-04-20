import express from 'express';
import articleController from '../../controllers/article';
import AuthToken from '../../middlewares/tokenValidation';
import errorHandler from '../../middlewares/errorHandler';

const router = express.Router();

router.get('/', articleController.getAllArticles);
router.post('/', AuthToken, errorHandler(articleController.createArticle));
router.get('/:slug', errorHandler(articleController.getArticle));
router.post('/', articleController.createArticle);
router.delete('/:slug', articleController.deleteArticle);
router.put('/:slug');

export default router;
