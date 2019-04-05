import express from 'express';
import passport from 'passport';

const router = express.Router();
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
