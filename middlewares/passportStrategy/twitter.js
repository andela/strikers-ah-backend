import TwitterStrategy from 'passport-twitter';
import { GetSocialTwitter } from '../callbackHandler';
/**
 * @author Jacques Nyilinkindi
 * @returns Twitter strategy
 */
const Twitter = new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK,
},
async (token, tokenSecret, profile, done) => {
  GetSocialTwitter(
    token, tokenSecret, profile, done
  );
});
export default Twitter;
