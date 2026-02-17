
import mongoose from 'mongoose';

const collegeRequestSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    adminName: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
    },
    adminPassword: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

export default mongoose.model('CollegeRequest', collegeRequestSchema);
