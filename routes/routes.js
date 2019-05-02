import express from 'express';
import articleRoutes from './api/articles';
import authentication from './api/authentication';
import profiles from './api/profiles';

const app = express();

app.use('/auth', authentication);
app.use('/articles', articleRoutes);
app.use('/profiles', profiles);

export default app;
