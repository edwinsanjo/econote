
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    college: {
        type: String,
        required: [true, 'Please add a college'],
    },
    branch: {
        type: String,
        required: [true, 'Please add a branch'],
    },
    semester: {
        type: Number,
        required: [true, 'Please add a semester'],
    },
    year: {
        type: Number,
    },
    bio: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['student', 'college_admin', 'app_admin'],
        default: 'student',
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);
