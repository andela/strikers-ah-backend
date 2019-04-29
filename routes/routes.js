import express from 'express';
import articleRoutes from './api/articles';
import authentication from './api/authentication';
import profiles from './api/profiles';
import searchRoute from './api/searchRoute';
import users from './api/users';

const app = express();

app.use('/auth', authentication);
app.use('/articles', articleRoutes);
app.use('/profiles', profiles);
app.use('/search', searchRoute);
app.use('/users', users);

export default app;
