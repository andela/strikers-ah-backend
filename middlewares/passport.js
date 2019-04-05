import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';
import models from '../models/index';

const User = models.user;
dotenv.config();

const radomUserName = (fname, lname) => {
  let userName = `${fname} ${lname}`;
  userName = userName.toLowerCase();
  userName = userName.replace(' ', '.');
  const randomNumber = Math.floor(Math.random() * 1000);
  userName = `${userName}.${randomNumber}`;
  return userName;
};

const socialAuth = (passport) => {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK,
    scope: ['r_liteprofile']
  }, ((accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  })));
  // @login with twitter
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
  },
  ((token, tokenSecret, profile, cb) => {
    const { _json } = profile;
    // Replace for getting large image
    let image = _json.profile_image_url;
    image = image.replace('_normal', '');

    // Remove special characters from name + emojis
    let names = _json.name;
    names = names.replace(/[^a-zA-Z ]/g, '').trim(); // Regex from stackoveflow
    // Split Functions from stackoverflow
    const firstName = names.split(' ').slice(0, -1).join(' ');
    const lastName = names.split(' ').slice(-1).join(' ');

    const username = radomUserName(firstName, lastName);

    const profileData = {
      username,
      firstname: firstName,
      lastname: lastName,
      bio: _json.description,
      provider: 'twitter',
      image,
      provideruserid: _json.id.toString()
    };

    User.findOrCreate({ where: { provideruserid: profileData.provideruserid, provider: profileData.provider }, defaults: profileData })
      .then(([users, created]) => {
        if (!users) {
          const user = created;
          cb(null, user);
        } else {
          const user = users;
          cb(null, user);
        }
      })
      .catch((error) => {
        cb(null, false, error);
      });
  })));

  //
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => done(null, user))
      .catch(err => done(null, false, err));
  });
};

export default socialAuth;
