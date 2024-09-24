import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    thumbnail: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Category', CategorySchema);
