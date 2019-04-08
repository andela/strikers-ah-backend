import express from 'express';
import passport from 'passport';
import user from '../controllers/user';
import validations from '../middlewares/validations';
import schema from '../helpers/schema';

const router = express.Router();

router.post('/login', validations.validate(schema.loginSchema, schema.options), user.loginWithEmail);

router.post('/', validations.validate(schema.signUpSchema, schema.options), user.signUpWithEmail);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: 'auth/google' }), user.socialLogin);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), user.socialLogin);

export default router;
