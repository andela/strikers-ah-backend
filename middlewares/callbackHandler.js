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
const GetSocialTwitterGithub = async (token, tokenSecret, profile, done) => {
  const { _json } = profile;
  const image = _json.avatar_url || usernamestring.largeTwitterImage(_json.profile_image_url);
  const names = usernamestring.removeSpecialCharacters(_json.name);

  const SocialUser = {
    username: usernamestring.getUsername(profile.username),
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
