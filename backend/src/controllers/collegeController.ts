
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import CollegeRequest from '../models/collegeRequestModel';
import User from '../models/userModel';
import sendEmail from '../utils/sendEmail';

// @desc    Submit a request to register a new college
// @route   POST /api/colleges/request
// @access  Public
export const requestCollegeRegistration = async (req: Request, res: Response) => {
    const { collegeName, location, adminName, adminEmail, adminPassword } = req.body;

    if (!collegeName || !location || !adminName || !adminEmail || !adminPassword) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if college/admin already exists in requests or users
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const existingRequest = await CollegeRequest.findOne({ adminEmail, status: 'pending' });
    if (existingRequest) {
        return res.status(400).json({ message: 'A pending request for this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const request = await CollegeRequest.create({
        collegeName,
        location,
        adminName,
        adminEmail,
        adminPassword: hashedPassword,
    });

    res.status(201).json({ message: 'Registration request submitted. Pending admin approval.' });
};

// @desc    Get all pending college requests
// @route   GET /api/colleges/requests
// @access  Private (App Admin only)
export const getCollegeRequests = async (req: Request, res: Response) => {
    try {
        const requests = await CollegeRequest.find({ status: 'pending' });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve a college request
// @route   PUT /api/colleges/approve/:id
// @access  Private (App Admin only)
export const approveCollegeRequest = async (req: Request, res: Response) => {
    const request = await CollegeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
        return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    // Create the Admin User
    const user = await User.create({
        name: request.adminName,
        email: request.adminEmail,
        password: request.adminPassword, // Already hashed
        college: request.collegeName,
        branch: 'Administration',
        semester: 0,
        role: 'college_admin',
        isVerified: true,
    });

    if (user) {
        request.status = 'approved';
        await request.save();

        // Send Approval Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Econote - College Registration Approved',
                message: `Congratulations! Your request to register ${request.collegeName} has been approved. You can now log in as a College Admin.`,
            });
        } catch (err) {
            console.error('Failed to send approval email', err);
        }

        res.json({ message: 'College request approved and admin user created.' });
    } else {
        res.status(500).json({ message: 'Failed to create admin user' });
    }
};

// @desc    Reject a college request
// @route   PUT /api/colleges/reject/:id
// @access  Private (App Admin only)
export const rejectCollegeRequest = async (req: Request, res: Response) => {
    const request = await CollegeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'College request rejected.' });
};
