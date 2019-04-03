const serializePassportUser = (passport, user) => {
  passport.serializeUser((Ruser, done) => {
    done(null, Ruser.id);
  });
  passport.deserializeUser((id, done) => {
    user.findByPk(id).then((Ruser) => {
      done(null, Ruser);
    })
      .catch(err => done(err, false));
  });
};
export default serializePassportUser;
