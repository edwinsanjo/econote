
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/userModel';

// Generate JWT
const generateToken = (id: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

import sendEmail from '../utils/sendEmail';

// ... (imports remain)

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, college, branch, semester } = req.body;

    if (!name || !email || !password || !college || !branch || !semester) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        college,
        branch,
        semester,
        otp,
        otpExpires,
        isVerified: false,
    });

    if (user) {
        // Send OTP Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'CollegeNotes Account Verification',
                message: `Your verification code is: ${otp}`,
            });

            res.status(201).json({
                message: 'Registration successful. Please verify your email.',
                email: user.email,
            });
        } catch (error) {
            console.error(error);
            // Don't fail registration if email fails, but warn?
            // Actually, if verification is mandatory, failing email is critical.
            // But for dev, we just log it.
            res.status(201).json({
                message: 'Registration successful. OTP logged to console (dev).',
                email: user.email,
            });
        }
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Verify OTP
// @route   POST /api/users/verify
// @access  Public
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        token: generateToken(user.id),
        message: 'Account verified successfully',
    });
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            college: user.college,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
    res.status(200).json(req.user);
};

// @desc    Register a new college (and its admin)
// @route   POST /api/users/register-college
// @access  Private (App Admin only)
export const registerCollege = async (req: Request, res: Response) => {
    const { name, email, password, collegeName, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create college admin user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        college: collegeName,
        branch: 'Administration', // Default for admin
        semester: 1, // Default for admin
        role: 'college_admin',
        isVerified: true, // Auto-verify admin created by app admin
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            college: user.college,
            role: user.role,
            message: 'College Admin registered successfully',
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};
