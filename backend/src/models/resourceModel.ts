
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
    },
    semester: {
        type: Number,
        required: [true, 'Please add a semester'],
    },
    type: {
        type: String,
        enum: ['Notes', 'Question Papers', 'Solutions', 'Project Reports', 'Study Material'],
        required: [true, 'Please add a resource type'],
    },
    year: {
        type: Number,
        required: [true, 'Please add a year'],
    },
    description: {
        type: String,
    },
    fileUrl: {
        type: String,
        required: [true, 'Please upload a file'],
    },
    privacy: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public',
    },
    tags: [String],
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collegeOfOrigin: {
        type: String,
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: 0,
    },
    voters: {
        type: Map,
        of: Number,
        default: {},
    },
    views: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

export default mongoose.model('Resource', resourceSchema);
