import express from 'express';
import user from '../controllers/user';
import validations from '../middleware/validations';

const router = express.Router();
router.post('/', validations.signUpValidations, user.signUpWithEmail);
export default router;
