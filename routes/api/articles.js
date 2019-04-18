import express from 'express';
import articleController from '../../controllers/article';

const router = express.Router();

router.post('/', articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.delete('/:slug');
router.put('/:slug');


export default router;
