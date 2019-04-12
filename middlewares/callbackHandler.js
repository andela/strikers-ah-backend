/* eslint-disable no-underscore-dangle */
import userHandler from '../helpers/userHandler';

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

  const handleUser = new userHandler();
  const SocialUser = {
    email: profile._json.email,
    username: handleUser.getUsername(profile.displayName),
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
const GetSocialTwitterGithub = async (token, tokenSecret, profile, done) => {
  const handleUser = new userHandler();
  const { _json } = profile;
  const image = _json.avatar_url || handleUser.largeTwitterImage(_json.profile_image_url);
  const names = handleUser.removeSpecialCharacters(_json.name);

  const SocialUser = {
    username: handleUser.getUsername(profile.username),
    firstname: names,
    image,
    bio: _json.description || _json.bio,
    provider: _json.provider || profile.provider,
    provideruserid: _json.id.toString()
  };
  done(null, SocialUser);
};
export {
  GetSocial,
  GetSocialTwitterGithub
};
