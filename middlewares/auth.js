import dotenv from 'dotenv';
import passport from 'passport';
import serializePassportUser from './serialize';
import facebookStrategy from './passportStrategy/facebook';
import GoogleStrategy from './passportStrategy/google';
import models from '../models/index';

const { user } = models;

dotenv.config();
/**
 * take passport strategy
 */
class Strategy {
  /**
   * @author frank harerimana
   * @param {*} passport
   * @return { O } strategy
   */
  constructor() {
    this.facebookStrategy = passport.use(facebookStrategy);
    this.GoogleStrategy = passport.use(GoogleStrategy);
    this.serializePassportUser = serializePassportUser(passport, user);
  }
}
export default Strategy;
