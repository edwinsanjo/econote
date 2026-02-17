
import { Request, Response } from 'express';
import Review from '../models/reviewModel';
import Resource from '../models/resourceModel';

// @desc    Create new review
// @route   POST /api/resources/:id/reviews
// @access  Private
export const createReview = async (req: any, res: Response) => {
    const { rating, comment } = req.body;
    const resourceId = req.params.id;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
    }

    const alreadyReviewed = await Review.findOne({
        resource: resourceId,
        user: req.user.id,
    });

    if (alreadyReviewed) {
        return res.status(400).json({ message: 'Resource already reviewed' });
    }

    const review = await Review.create({
        resource: resourceId,
        user: req.user.id,
        rating: Number(rating),
        comment,
    });

    // Calculate Average Rating
    const reviews = await Review.find({ resource: resourceId });
    resource.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await resource.save();

    res.status(201).json(review);
};

// @desc    Get reviews for a resource
// @route   GET /api/resources/:id/reviews
// @access  Private/Public
export const getReviews = async (req: Request, res: Response) => {
    const reviews = await Review.find({ resource: req.params.id }).populate('user', 'name');
    res.json(reviews);
};
