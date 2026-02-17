
import express from 'express';
import { requestCollegeRegistration, getCollegeRequests, approveCollegeRequest, rejectCollegeRequest } from '../controllers/collegeController';
import { protect } from '../middleware/authMiddleware';

// Middleware to check for app_admin role
const appAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'app_admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const router = express.Router();

router.post('/request', requestCollegeRegistration);
router.get('/requests', protect, appAdmin, getCollegeRequests);
router.put('/approve/:id', protect, appAdmin, approveCollegeRequest);
router.put('/reject/:id', protect, appAdmin, rejectCollegeRequest);

export default router;
