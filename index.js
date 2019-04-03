import express from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import SocialLogin from './middlewares/passport';
import routes from './routes/routes';

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.secretKey,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
SocialLogin(passport);
app.use('/api', routes);
app.get('/', (req, res) => {
  if (!req.user) res.json({ user: 'welcome' });
  const {
    id, firstname, lastname, username,
  } = req.user.dataValues;
  res.json({ user: `welcome: ${firstname} ${lastname}` });
});

const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
