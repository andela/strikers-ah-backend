import express from 'express';
import users from './user';

const router = express.Router();


router.use(users);
export default router;
