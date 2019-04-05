import express from 'express';
import passport from 'passport';

const router = express.Router();

/* Github ROUTER */
router.get('/auth/github', passport.authenticate('github', { state: 'SOME STATE' }), (req, res) => {});
router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
//
router.get('/auth/twitter',
  passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

export default router;
