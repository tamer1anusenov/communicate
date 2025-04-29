import { Router } from 'express';
import { getMyResults, getResultById } from '../controllers/testResult.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/my', authenticate, getMyResults);
router.get('/:id', authenticate, getResultById);

export default router;