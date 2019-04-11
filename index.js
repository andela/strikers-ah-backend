/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './routes/routes';
import user from './routes/user';
import Strategy from './middlewares/auth';

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((express.json()));

app.use('/api/users', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

app.listen(port);
app.use(passport.initialize());
const strategy = new Strategy();
app.use('/api/v1/login', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '/view/') });
});


export default app;
