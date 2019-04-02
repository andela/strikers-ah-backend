import express from 'express';
import passport from 'passport';

const router = express.Router();

/* Linkedin ROUTER */
// route.get('/auth/linkedin', user.linkedInLogin);
router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }), (req, res) => {});
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

export default router;
