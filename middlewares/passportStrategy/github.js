import GithubStrategy from 'passport-github';
import { GetSocialTwitterGithub } from '../callbackHandler';
/**
 * @author Jacques Nyilinkindi
 * @returns Github strategy
 */
const Github = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/github/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    GetSocialTwitterGithub(
      accessToken,
      refreshToken,
      profile,
      done
    );
  }
);
export default Github;
