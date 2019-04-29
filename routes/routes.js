import express from 'express';
import articleRoutes from './api/articles';
import authentication from './api/authentication';
import users from './api/users';

const app = express();

app.use('/auth', authentication);
app.use('/articles', articleRoutes);
app.use('/users', users);

export default app;
