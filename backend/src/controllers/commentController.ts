import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import Resource from '../models/resourceModel';

// @desc    Get comments for a resource
// @route   GET /api/resources/:resourceId/comments
// @access  Public
export const getComments = async (req: any, res: Response) => {
    try {
        const comments = await Comment.find({ resource: req.params.resourceId })
            .populate('user', 'name profilePicture') // Assuming User model has profilePicture
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a comment
// @route   POST /api/resources/:resourceId/comments
// @access  Private
export const createComment = async (req: any, res: Response) => {
    try {
        console.log('Comment request:', req.body, 'Params:', req.params);
        const { content, parentComment } = req.body;
        const resourceId = req.params.resourceId;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const comment = await Comment.create({
            resource: resourceId,
            user: req.user.id,
            content,
            parentComment: parentComment || null,
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'name profilePicture');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
