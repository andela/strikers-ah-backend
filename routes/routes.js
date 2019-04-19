import express from 'express';
import articleRoutes from './api/articles';
import authentication from './api/authentication';
import follwingRoute from './api/following';

const app = express();

app.use('/auth', authentication);
app.use('/articles', articleRoutes);
app.use('/profiles', follwingRoute);

export default app;
