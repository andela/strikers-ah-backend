/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import routes from './routes/routes';

dotenv.config();

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use((express.json()));
app.use(fileUpload());
app.use(session({
  secret: process.env.secretKey,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.static(path.resolve(__dirname, 'view/')));

const port = process.env.PORT || 3000;

app.listen(port);

export default app;
