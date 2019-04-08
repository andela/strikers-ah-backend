import FacebookStrategy from 'passport-facebook';
import GetSocial from '../callbackHandler';
/**
 * @author frank harerimana
 * @returns Facebook strategy
 */
const Facebook = new FacebookStrategy(
  {
    callbackURL: process.env.FacebookCallback_URL,
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    profileFields: ['email', 'displayName', 'picture']
  },
  async (accessToken, refreshToken, profile, done) => {
    GetSocial(
      accessToken,
      refreshToken,
      profile,
      done,
    );
  }
);
export default Facebook;
