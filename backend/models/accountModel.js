import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    accountId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    fcmToken: {
        type: String,
        required: false
    },
    pinCode: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

AccountSchema.index({accountId: 1});
export default mongoose.model('Account', AccountSchema);
