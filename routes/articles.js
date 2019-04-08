import express from 'express';
import articleController from '../controllers/article';
import validation from '../middleware/validations';

const router = express.Router();

router.post('/', validation, articleController.createArticle);

export default router;
