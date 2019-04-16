import express from 'express';
import authentication from './authentication';

const app = express();

app.use('/auth', authentication);

export default app;
