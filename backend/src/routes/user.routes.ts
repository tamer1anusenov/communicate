import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;