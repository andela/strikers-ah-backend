import express from 'express';
import articleController from '../../controllers/article';
import secureRoute from '../../middlewares/tokenValidation';

const router = express.Router();

router.post('/', secureRoute, articleController.createArticle);
router.get('/');
router.delete('/:slug');
router.put('/:slug');

router.post('/:slug/comments', secureRoute, articleController.addComment);

export default router;
