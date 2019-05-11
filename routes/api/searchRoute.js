import express from 'express';
import searchController from '../../controllers/search';
import errorHandler from '../../middlewares/errorHandler';

const router = express.Router();

router.get('/', errorHandler(searchController.systemSearch));

export default router;
