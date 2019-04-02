import express from 'express';
import passport from 'passport';
import LinkedIn from './middlewares/passport';

import routes from './routes/routes';

const app = express();
app.use('/api', routes);
app.use(passport.initialize());
LinkedIn(passport);
const port = process.env.PORT || 3000;

app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port', port);
