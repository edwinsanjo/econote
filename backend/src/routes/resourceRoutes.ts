
import express from 'express';
import {
    createResource,
    getResources,
    getResourceById,
    deleteResource,
} from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

import reviewRouter from './reviewRoutes';

const router = express.Router();

// Re-route into other resource routers
router.use('/:id/reviews', reviewRouter);

router.route('/')
    .get(protect, getResources) // Using protect to get user info for filtering, though it could be optional for public only
    .post(protect, upload.single('file'), createResource);

router.route('/:id')
    .get(protect, getResourceById)
    .delete(protect, deleteResource);

export default router;
