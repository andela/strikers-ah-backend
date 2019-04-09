import dotenv from 'dotenv';
import passport from 'passport';
import serializePassportUser from './serialize';
import facebookStrategy from './passportStrategy/facebook';
import GoogleStrategy from './passportStrategy/google';
import TwitterStrategy from './passportStrategy/twitter';
import models from '../models/index';

const { user } = models;

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
    this.serializePassportUser = serializePassportUser(passport, user);
  }
}
export default Strategy;
