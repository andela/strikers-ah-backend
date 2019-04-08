/* eslint-disable no-unused-vars */
import express from 'express';
import { errors } from 'celebrate';
import bodyParser from 'body-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import user from './routes/user';
// import Strategy from './middlewares/auth';
import articleRoutes from './routes/articles';

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
// const strategy = new Strategy();
app.use('/api/v1/login', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/article', articleRoutes);
app.use(errors());
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Author haven'
  });
});

const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);

export default app;
