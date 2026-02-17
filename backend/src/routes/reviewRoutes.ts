
import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(protect, createReview)
    .get(getReviews);

export default router;
