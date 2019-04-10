import express from 'express';
import passport from 'passport';
import user from '../controllers/user';

const router = express.Router();

router.post('/login', user.loginWithEmail);

router.post('/', user.signUpWithEmail);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'auth/google' }), user.socialLogin);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), user.socialLogin);

export default router;
