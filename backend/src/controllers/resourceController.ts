
import { Request, Response } from 'express';
import Resource from '../models/resourceModel';
import fs from 'fs';
import path from 'path';

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req: any, res: Response) => {
    try {
        const { title, subject, semester, type, year, description, privacy, tags } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const resource = await Resource.create({
            title,
            subject,
            semester,
            type,
            year,
            description,
            fileUrl: req.file.path, // Cloudinary URL
            privacy,
            tags: tags ? tags.split(',') : [],
            uploader: req.user.id,
            collegeOfOrigin: req.user.college,
        });

        res.status(201).json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all resources with filters
// @route   GET /api/resources
// @access  Private/Public (depending on resource privacy)
export const getResources = async (req: any, res: Response) => {
    try {
        const { keyword, subject, semester, type, privacy, college, uploader } = req.query;

        let query: any = {};

        // Search by keyword in title, subject, or tags
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { subject: { $regex: keyword, $options: 'i' } },
                { tags: { $regex: keyword, $options: 'i' } },
            ];
        }

        // Filter fields
        if (subject) query.subject = subject;
        if (semester) query.semester = semester;
        if (type) query.type = type;
        if (uploader) query.uploader = uploader;

        // Privacy & Access Control
        // If user is logged in, they can see Public + Private from their college
        // If user is NOT logged in or requesting specific privacy type logic:
        // This part depends on if we enforce auth for ALL fetching or allow public browsing.
        // The requirement says "Index resource should show full details... User Dashboard...".
        // "Access Verification: System must verify user's college before granting access to private resources"

        // We'll trust req.user is set by auth middleware if present.
        // If not present, only show public.

        if (req.user) {
            query.$or = [
                ...(query.$or || []),
                { privacy: 'Public' },
                { privacy: 'Private', collegeOfOrigin: req.user.college }
            ];
            // If the user explicitly asks for 'Private', we filter further, but still respect the college constraint
            if (privacy === 'Private') {
                query.privacy = 'Private';
                query.collegeOfOrigin = req.user.college;
            } else if (privacy === 'Public') {
                query.privacy = 'Public';
            }
        } else {
            // Guest users only see public
            query.privacy = 'Public';
        }

        // Sorting
        const { sort } = req.query;
        let sortOption: any = { createdAt: -1 }; // Default: Latest

        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'top') {
            sortOption = { score: -1 };
        } else if (sort === 'popular') {
            sortOption = { views: -1 }; // Assuming we track views
        }

        const resources = await Resource.find(query)
            .populate('uploader', 'name')
            .sort(sortOption);

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
export const getResourceById = async (req: any, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('uploader', 'name college branch');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Access Check
        if (resource.privacy === 'Private') {
            if (!req.user || req.user.college !== resource.collegeOfOrigin) {
                return res.status(403).json({ message: 'Access denied. Private resource.' });
            }
        }

        res.json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (req: any, res: Response) => {
    try {
        const { title, subject, semester, type, year, description, privacy, tags } = req.body;

        let resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check ownership
        if (resource.uploader.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        resource.title = title || resource.title;
        resource.subject = subject || resource.subject;
        resource.semester = semester || resource.semester;
        resource.type = type || resource.type;
        resource.year = year || resource.year;
        resource.description = description || resource.description;
        resource.privacy = privacy || resource.privacy;
        resource.tags = tags ? (typeof tags === 'string' ? tags.split(',') : tags) : resource.tags;

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req: any, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check ownership
        if (resource.uploader.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await resource.deleteOne();

        res.json({ message: 'Resource removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Vote on resource
// @route   POST /api/resources/:id/vote
// @access  Private
export const voteResource = async (req: any, res: Response) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'
        const userId = req.user.id;
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Initialize voters map if undefined (though default handles this, good for safety)
        if (!resource.voters) {
            resource.voters = new Map();
        }

        const currentVote = resource.voters.get(userId);
        let voteValue = 0;

        if (voteType === 'upvote') {
            voteValue = 1;
        } else if (voteType === 'downvote') {
            voteValue = -1;
        }

        // Logic for toggling or changing vote
        if (currentVote === voteValue) {
            // Toggle off (remove vote)
            resource.voters.delete(userId);
            if (voteValue === 1) resource.upvotes--;
            if (voteValue === -1) resource.downvotes--;
        } else {
            // New vote or change vote
            if (currentVote) {
                // Remove previous vote effect
                if (currentVote === 1) resource.upvotes--;
                if (currentVote === -1) resource.downvotes--;
            }

            // Add new vote
            resource.voters.set(userId, voteValue);
            if (voteValue === 1) resource.upvotes++;
            if (voteValue === -1) resource.downvotes++;
        }

        resource.score = resource.upvotes - resource.downvotes;
        resource.markModified('voters');
        await resource.save();

        res.json({
            upvotes: resource.upvotes,
            downvotes: resource.downvotes,
            score: resource.score,
            userVote: resource.voters.get(userId)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
