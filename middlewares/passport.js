import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';

dotenv.config();


const socialAuth = (passport) => {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK,
    scope: ['r_liteprofile']
  }, ((accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log(profile);
      return done(null, profile);
    });
  })));
};

export default socialAuth;
