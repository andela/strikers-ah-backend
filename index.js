/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((express.json()));
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

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0');

export default app;
