
import express from 'express';
import { registerUser, loginUser, getMe, verifyOtp, registerCollege } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOtp);
router.post('/register-college', protect, registerCollege); // Should add admin middleware check
router.get('/me', protect, getMe);

export default router;
