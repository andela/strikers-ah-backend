import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', (req, res) => {
  res.sendStatus(200);
});

app.use('/api', routes);
const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
