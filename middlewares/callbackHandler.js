/* eslint-disable no-underscore-dangle */
import usernameGenerator from './uniquestring';

/**
 * @author frank harerimana
 * @param {*} accessToken
 * @param {*} refreshToken
 * @param {*} profile
 * @param {*} done
 * @returns { Object } user
 */
const GetSocial = async (accessToken, refreshToken, profile, done) => {
  /**
   * get unique formatted username
   */
  const usernamestring = new usernameGenerator(profile.displayName);

  const SocialUser = {
    email: profile._json.email,
    username: usernamestring.getUsername(),
    firstname: profile.name.familyName,
    lastname: profile.name.givenName,
    image: profile.photos[0].value,
    provider: profile.provider,
    provideruserid: profile.id
  };

  done(null, SocialUser);
};
export default GetSocial;
