
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
    },
}, {
    timestamps: true,
});

// Prevent user from submitting more than one review per resource
reviewSchema.index({ resource: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
