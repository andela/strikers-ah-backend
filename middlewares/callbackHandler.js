/* eslint-disable no-underscore-dangle */
import models from '../models/index';

const { user } = models;
const MyUSername = providerUSername => providerUSername.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000);

const GetSocial = (accessToken, refreshToken, profile, done) => {
  const SocialUser = {
    email: profile._json.email,
    username: MyUSername(profile.displayName),
    firstname: profile.name.familyName,
    lastname: profile.name.givenName,
    image: profile.photos[0].value,
    provider: 'facebook',
    provideruserid: profile.id
  };
  user.findOrCreate({
    where: { provideruserid: SocialUser.provideruserid },
    defaults: SocialUser
  })
    .then(([nUser, created]) => {
      if (!nUser) {
        const Ruser = created;
        done(null, Ruser);
      } else {
        const Ruser = nUser;
        done(null, Ruser);
      }
    })
    .catch(err => done(err, false));
};
export default GetSocial;
