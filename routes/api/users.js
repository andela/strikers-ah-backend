import express from 'express';
import user from '../../controllers/user';
import secureRoute from '../../middlewares/tokenValidation';

const router = express.Router();

router.get('/:username/stats', secureRoute, user.getReadingHistory);
router.get('/', secureRoute, user.getAllUsers);
router.get('/:username', secureRoute, user.getUserInformation);
router.post('/:username/role', secureRoute, user.assignRole);

export default router;
