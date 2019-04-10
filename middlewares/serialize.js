const serializePassportUser = (passport, user) => {
  passport.serializeUser((SocialUser, done) => {
    done(null, SocialUser.provideruserid);
  });
  passport.deserializeUser((provideruserid, done) => {
    user.findOne({ where: { provideruserid } }).then((SocialUser) => {
      done(null, SocialUser);
    })
      .catch(err => done(err, false));
  });
};
export default serializePassportUser;
