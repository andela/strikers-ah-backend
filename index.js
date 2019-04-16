/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import routes from './routes/routes';
import Strategy from './middlewares/auth';
import articleRoutes from './routes/articles';

dotenv.config();

const strategy = new Strategy();
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((express.json()));

app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/articles', articleRoutes);
app.use('/api/users', user);
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Author Haven'
  });
});

const port = process.env.PORT || 3000;

app.listen(port);

export default app;
