import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    shoes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoes',
        required: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Favorite', FavoriteSchema);
