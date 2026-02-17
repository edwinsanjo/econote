
import mongoose from 'mongoose';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://edwin:3X5Hh0B6qD8UAn35@cluster.omndo6m.mongodb.net/econotes?retryWrites=true&w=majority&appName=CLUSTER';
const JWT_SECRET = process.env.JWT_SECRET || 'superSecretKey123';
const API_URL = 'http://localhost:5000/api';

const imagePath = path.join(__dirname, 'test-image.jpg');
fs.writeFileSync(imagePath, 'placeholder image content');

const runTest = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = `test_profile_${Date.now()}@test.com`;

        console.log('Creating Test User:', email);
        const user = await User.create({
            name: 'Test Profile User',
            email,
            password: 'hashedpassword',
            college: 'Test College',
            branch: 'CS',
            semester: 1,
            isVerified: true
        });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        console.log('Generated token for user:', user._id);

        const form = new FormData();
        form.append('bio', 'Test Bio');
        form.append('year', '2');

        const fileBuffer = fs.readFileSync(imagePath);
        const fileBlob = new Blob([fileBuffer], { type: 'text/plain' });
        form.append('profilePicture', fileBlob, 'test-image.jpg');

        console.log('Sending PUT request to /users/profile...');
        const res = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });

        // Parse JSON response
        const text = await res.text();
        console.log('Raw Response:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { message: 'Non-JSON response' };
        }

        console.log('Response Status:', res.status);
        if (!res.ok) {
            console.log('Test Failed. Error Message:', data.message || data);
        } else {
            console.log('Test Successful:', data);
        }

        // Cleanup
        console.log('Cleaning up...');
        await User.deleteOne({ _id: user._id });
        fs.unlinkSync(imagePath);
        await mongoose.disconnect();

    } catch (error: any) {
        console.error('Test Script Error:', error.message);
        console.error(error);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        try { fs.unlinkSync(imagePath); } catch { }
    }
};

runTest();
