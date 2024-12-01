import mongoose from 'mongoose';

const ShoesReviewSchema = new mongoose.Schema({
    shoes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Shoes',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    feedback: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('ShoesReview', ShoesReviewSchema);
