import express from 'express';
import user from '../controllers/user';

const route = express.Router();

/* TWITTER ROUTER */
route.get('auth/twitter', user.twitterLogin);

route.get('auth/twitter/callback', user.twitterCallback);

export default route;
