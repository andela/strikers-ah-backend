import express from 'express';
import user from '../../controllers/user';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/:username/follow', (req, res, next) => {
  new verifyToken(req, res, next).verify();
}, user.follow);

router.delete('/:username/follow', (req, res, next) => {
  new verifyToken(req, res, next).verify();
}, user.unfollow);

export default router;
