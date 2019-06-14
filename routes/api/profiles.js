import express from 'express';
import user from '../../controllers/user';
import verifyToken from '../../middlewares/verifyToken';
import Strategy from '../../middlewares/auth';
import helper from '../../helpers/helper';
import Notifications from '../../controllers/notifications';

const router = express.Router();

router.post(
  '/:username/follow',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.follow,
);

router.delete(
  '/:username/follow',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.unfollow,
);
router.put(
  '/notifications/emails',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  Notifications.optEmailNotifications
);
router.get(
  '/notifications/emails',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  Notifications.checkUserEmailNotificationStatus
);
router.put('/:username', Strategy.verifyToken, helper.asyncHandler(user.editProfile));
router.get(
  '/notifications',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.notifications,
);
router.get('/:username', helper.asyncHandler(user.getUserProfile));

router.put(
  '/notifications/:id',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.readNotification,
);

router.get(
  '/followers',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.findAllFollowers,
);

router.get(
  '/following',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.findAllFollowing,
);

router.get(
  '/status/:username',
  (req, res, next) => {
    new verifyToken(req, res, next).verify();
  },
  user.findProfilestatus,
);

export default router;
