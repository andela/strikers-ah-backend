import express from 'express';
import articleController from '../../controllers/article';
import articleCommentController from '../../controllers/articlecomment';
import secureRoute from '../../middlewares/tokenValidation';

const router = express.Router();

router.post('/', secureRoute, articleController.createArticle);
router.get('/');
router.delete('/:slug');
router.put('/:slug');

router.post('/:slug/comments', secureRoute, articleCommentController.addComment);
router.get('/:slug/comments', secureRoute, articleCommentController.getComments);
router.put('/:slug/comments/:commentid', secureRoute, articleCommentController.updateComment);
router.delete('/:slug/comments/:commentid', secureRoute, articleCommentController.deleteComment);

export default router;
