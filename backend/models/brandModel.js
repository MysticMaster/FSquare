import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
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

export default mongoose.model('Brand', BrandSchema);
