import express from 'express';
import passport from 'passport';
import user from '../controllers/user';

const route = express.Router();

route.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
route.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'auth/google' }), user.socialLogin);
// passport.authenticate('google', user.googleLogin)
route.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
route.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), user.socialLogin);

export default route;
