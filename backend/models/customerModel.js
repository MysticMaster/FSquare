import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        default: "Your First Name"
    },
    lastName: {
        type: String,
        required: true,
        default: "Your Last Name"
    },
    avatar: {
        type: String
    },
    birthDay: {
        type: Date,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    longitude: {
        type: Number,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    role: {
        type: String,
        default: "customer"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Customer', CustomerSchema);
