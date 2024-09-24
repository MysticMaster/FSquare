import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        default: "admin"
    },
    authority: {
        type: String,
        enum: ["superAdmin", "salesperson"],
        default: "salesperson"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Admin', AdminSchema);
