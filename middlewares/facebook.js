/* eslint-disable no-underscore-dangle */
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import models from '../models/index';

const { user } = models;

dotenv.config();

const fbStrategy = (passport) => {
  passport.use(new FacebookStrategy({
    callbackURL: process.env.FacebookCallback_URL,
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    profileFields: ['email', 'displayName']
  },
  ((accessToken, refreshToken, profile, done) => {
    const username = profile.displayName.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
    const Fkuser = {
      email: profile._json.email,
      username,
      name: profile.name.familyName + profile.name.givenName,
      provider: 'facebook',
      provideruserid: profile.id
    };
    user.findOrCreate({ where: { provideruserid: Fkuser.provideruserid }, defaults: Fkuser })
      .then(([nUser, created]) => {
        if (!nUser) {
          const Ruser = created;
          done(null, Ruser);
        } else {
          const Ruser = nUser;
          done(null, Ruser);
        }
      }).catch((err) => {
        done(err, false);
      });
  })));
  passport.serializeUser((Ruser, done) => {
    done(null, Ruser.id);
  });
  passport.deserializeUser((id, done) => {
    user.findByPk(id).then((Ruser) => {
      done(null, Ruser);
    }).catch(err => console.log(err));
  });
};

export default fbStrategy;
