import mongoose from 'mongoose';

const SizeSchema = new mongoose.Schema({
    classification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classification',
        required: true
    },
    sizeNumber: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Size', SizeSchema);
