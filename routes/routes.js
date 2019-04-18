import express from 'express';
import articleRoutes from './api/articles';
import authentication from './api/authentication';

const app = express();

app.use('/auth', authentication);
app.use('/articles', articleRoutes);

export default app;
