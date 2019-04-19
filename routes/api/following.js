import express from 'express';
import user from '../../controllers/user';

const router = express.Router();

router.get('/:follower(\\d+)', user.follow);

export default router;
