import express from 'express';

const router = express.Router();

router.post('/');
router.get('/');
router.delete('/:slug');
router.put('/:slug');


export default router;
