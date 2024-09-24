import mongoose from 'mongoose';

const ClassificationSchema = new mongoose.Schema({
    shoes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoes',
        required: true
    },
    thumbnail: {
        type: String
    },
    images: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    color: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Classification', ClassificationSchema);
