import express from 'express';
import AuthToken from '../../middlewares/tokenValidation';
import articleCategory from '../../controllers/category';

const router = express.Router();

router.post('/', AuthToken, articleCategory.addCategory);
router.get('/', AuthToken, articleCategory.getCategories);
router.put('/:id', AuthToken, articleCategory.updateCategory);
router.delete('/:id', AuthToken, articleCategory.deleteCategory);

export default router;
