import express from 'express';
import user from '../../controllers/user';

const router = express.Router();

router.post('/:username/follow', user.follow);

export default router;
