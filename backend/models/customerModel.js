import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    address: {
        type: String
    },
    wardName: {
        type: String,
    },
    districtName: {
        type: String,
    },
    provinceName: {
        type: String,
    },
    isDefault: {
        type: Boolean,
    }
}, {versionKey: false});

const CustomerSchema = new mongoose.Schema({
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
    email: {
        type: String,
        unique: true,
        required: true
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
        type: [AddressSchema],
        default: []
    },
    role: {
        type: String,
        default: "customer"
    },
    fcmToken: {
        type: String,
        required: false
    },
    lastLogin: {
        type: Number,
        default: 0
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

export default mongoose.model('Customer', CustomerSchema);
