import GoogleStrategy from 'passport-google-oauth20';
import GetSocial from '../callbackHandler';

const Google = new GoogleStrategy(
  {
    callbackURL: process.env.CallbackURL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }, async (accessToken, refreshToken, profile, done) => {
    GetSocial(
      accessToken,
      refreshToken,
      profile,
      done
    );
  }
);
export default Google;
