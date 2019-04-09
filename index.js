/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import user from './routes/user';
import Strategy from './middlewares/auth';

dotenv.config();

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((express.json()));

app.use('/api/users', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

app.listen(port);
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const strategy = new Strategy();
app.use('/api/v1/login', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req, res) => {
  res.send('Welcome');
});


export default app;
