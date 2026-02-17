
import express from 'express';
import { registerUser, loginUser, getMe, verifyOtp, registerCollege, resendOtp, updateUserProfile, getUserById } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOtp);
router.post('/verify/resend', resendOtp);
router.post('/register-college', protect, registerCollege);
router.get('/me', protect, getMe);
router.put('/profile', protect, (req, res, next) => {
    upload.single('profilePicture')(req, res, (err: any) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message || 'Image upload failed' });
        }
        next();
    });
}, updateUserProfile);
router.get('/:id', protect, getUserById);

export default router;
