/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import user from './routes/user';
import Strategy from './middlewares/auth';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
const strategy = new Strategy();
app.use('/api/v1/login', user);

const port = process.env.PORT || 3000;

app.listen(port);
