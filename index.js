/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import user from './routes/user';
import GoogleStrategy from './middlewares/google';
import FacebookStrategy from './middlewares/facebook';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
FacebookStrategy(passport);
GoogleStrategy(passport);
app.use('/api/v1/login', user);

const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
