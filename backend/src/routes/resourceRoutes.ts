
import express from 'express';
import {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource,
    voteResource,
} from '../controllers/resourceController';
import { createComment, getComments } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

console.log('Resource Router Loaded');

router.use((req, res, next) => {
    console.log('Resource Router request:', req.method, req.url);
    next();
});

// Comments routes
router.route('/:resourceId/comments')
    .post(protect, createComment)
    .get(getComments);

// Route: /api/resources

router.route('/')
    .get(protect, getResources) // Using protect to get user info for filtering, though it could be optional for public only
    .post(protect, upload.single('file'), createResource);

router.route('/:id')
    .get(protect, getResourceById)
    .put(protect, updateResource)
    .delete(protect, deleteResource);

router.route('/:id/vote').post(protect, voteResource);

export default router;
