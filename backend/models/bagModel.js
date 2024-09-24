import mongoose from 'mongoose';

const BagSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Bag', BagSchema);
