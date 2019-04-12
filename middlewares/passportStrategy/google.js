import GoogleStrategy from 'passport-google-oauth20';
import { GetSocial } from '../callbackHandler';

/**
 * @author frank harerimana
 * @return Google strategy
 */
const Google = new GoogleStrategy(
  {
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
export default Google;
