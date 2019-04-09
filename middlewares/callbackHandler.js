/* eslint-disable no-underscore-dangle */
import usernameGenerator from './uniquestring';

const usernamestring = new usernameGenerator();
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

  const SocialUser = {
    email: profile._json.email,
    username: usernamestring.getUsername(profile.displayName),
    firstname: profile.name.familyName,
    lastname: profile.name.givenName,
    image: profile.photos[0].value,
    provider: profile.provider,
    provideruserid: profile.id
  };

  done(null, SocialUser);
};

/**
 * @author Jacques Nyilinkindi
 * @param {*} token
 * @param {*} tokenSecret
 * @param {*} profile
 * @param {*} done
 * @returns { Object } user
 */
const GetSocialTwitter = async (token, tokenSecret, profile, done) => {
  /**
   * get unique formatted username
   */
  const { _json } = profile;
  // _json.profile_image_url.
  const image = usernamestring.generateLargeTwitterProfile(_json.profile_image_url);
  const names = usernamestring.removeSpecialCharacters(_json.name);

  const SocialUser = {
    username: usernamestring.getUsername(profile.username),
    firstname: names,
    image,
    bio: _json.description,
    provider: _json.provider,
    provideruserid: _json.id.toString()
  };
  done(null, SocialUser);
};
export {
  GetSocial,
  GetSocialTwitter
};
