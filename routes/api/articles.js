import express from 'express';
import articleController from '../../controllers/article';
import articleCommentController from '../../controllers/articlecomment';
import secureRoute from '../../middlewares/tokenValidation';

const router = express.Router();

router.post('/', secureRoute, articleController.createArticle);
router.get('/', secureRoute, articleController.getAllArticles);
router.get('/:slug', secureRoute, articleController.getArticle);
router.delete('/:slug');
router.put('/:slug');

router.post('/:slug/comments', secureRoute, articleCommentController.addComment);
router.get('/:slug/comments', secureRoute, articleCommentController.getComments);
router.put('/:slug/comments/:commentid', secureRoute, articleCommentController.updateComment);
router.delete('/:slug/comments/:commentid', secureRoute, articleCommentController.deleteComment);
router.post('/:slug/comments/:commentid/like', secureRoute, articleCommentController.likeComment);
router.get('/:slug/comments/popular', secureRoute, (req, res, next) => { req.commenttype = 'popular'; next(); }, articleCommentController.getComments);
router.get('/:slug/comments/:commentid/history', secureRoute, articleCommentController.commentEditHistory);


export default router;
