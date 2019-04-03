import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './routes/routes';

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((express.json()));

app.use('/api/users', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req, res) => {
  res.sendStatus(200);
});
app.use('/api', routes);
const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
export default app;
