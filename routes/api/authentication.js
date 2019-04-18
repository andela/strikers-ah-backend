import express from 'express';
import passport from 'passport';
import user from '../../controllers/user';
import Strategy from '../../middlewares/auth';

const router = express.Router();


// eslint-disable-next-line no-unused-vars
const strategy = new Strategy();

router.post('/login', user.loginWithEmail);
router.post('/signup', user.signUpWithEmail);

router.get('/google', passport.authenticate('google', { session: false, scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'auth/google' }), user.socialLogin);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/auth/facebook' }), user.socialLogin);

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/twitter' }), user.socialLogin);

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/github' }), user.socialLogin);

router.post('/forgetpassword', user.passwordreset);
router.put('/resetpassword/:token', user.resetpassword);
router.get('/verify/:hash', user.verifyUser);

export default router;
