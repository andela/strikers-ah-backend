import express from 'express';
import articleController from '../../controllers/article';
import AuthToken from '../../middlewares/tokenValidation';
import errorHandler from '../../middlewares/errorHandler';

const router = express.Router();

router.get('/all', errorHandler(articleController.getAllArticles));
router.post('/', AuthToken, errorHandler(articleController.createArticle));
router.get('/:slug', errorHandler(articleController.getArticle));
router.delete('/:slug', AuthToken, errorHandler(articleController.deleteArticle));
router.put('/:slug');

export default router;
