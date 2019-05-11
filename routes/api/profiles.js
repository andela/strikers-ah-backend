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

router.get('/notifications', (req, res, next) => {
  new verifyToken(req, res, next).verify();
}, user.notifications);

router.put('/notifications/:id', (req, res, next) => {
  new verifyToken(req, res, next).verify();
}, user.readNotification);

export default router;
