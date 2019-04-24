import express from 'express';
import articleController from '../../controllers/article';
import Strategy from '../../middlewares/auth';
import helper from '../../helpers/helper';

const router = express.Router();

router.post('/', articleController.createArticle);
router.get('/');
router.delete('/:slug');
router.put('/:slug');
router.patch('/:slug/:likeState', Strategy.verifyToken, helper.asyncHandler(articleController.likeArticle));


export default router;
