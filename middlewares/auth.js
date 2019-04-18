import dotenv from 'dotenv';
import passport from 'passport';
import serializePassportUser from './serialize';
import facebookStrategy from './passportStrategy/facebook';
import GoogleStrategy from './passportStrategy/google';
import TwitterStrategy from './passportStrategy/twitter';
import GithubStrategy from './passportStrategy/github';
import models from '../models/index';
import helper from '../helpers/helper';

const {
  user
} = models;

dotenv.config();
/**
 * take passport strategy
 */
class Strategy {
  /**
   * @author frank harerimana with Jacques Nyilinkindi
   * @param {*} passport
   * @return { O } strategy
   */
  constructor() {
    this.facebookStrategy = passport.use(facebookStrategy);
    this.GoogleStrategy = passport.use(GoogleStrategy);
    this.TwitterStrategy = passport.use(TwitterStrategy);
    this.GithubStrategy = passport.use(GithubStrategy);
    this.serializePassportUser = serializePassportUser(passport, user);
  }

  /**
   * @author Mwibutsa Floribert
   * @param { Object } req
   * @param { Object } res
   * @param { func } next
   * @returns { Object } -
   */
  static verifyToken(req, res, next) {
    try {
      helper.decodeToken(req);
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Please log into your account first'
      });
    }
  }
}
export default Strategy;
