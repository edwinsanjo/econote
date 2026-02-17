import express from 'express';
import { createComment, getComments } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(protect, createComment)
    .get((req: any, res, next) => {
        console.log('CommentRoutes GET / hit. ResourceId:', req.params.resourceId);
        next();
    }, getComments);

export default router;
