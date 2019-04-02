import express from 'express';
import bodyParser from 'body-parser';
// import routes from './routes/routes';
import userRouter from './routes/user';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((express.json()));

// app.use('/', routes);
app.use('/api/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
