import express from 'express';
import user from '../controllers/user';
import validations from '../middleware/validations';
import schema from '../helpers/schema';


const router = express.Router();
router.post('/', validations.validate(schema.signUpSchema, schema.options), user.signUpWithEmail);
export default router;
