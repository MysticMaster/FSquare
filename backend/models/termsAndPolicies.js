import mongoose from 'mongoose';

const PolicyContentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: false, versionKey: false})

const TermsAndPoliciesSchema = new mongoose.Schema({
    contents: {
        type: [PolicyContentSchema],
        default: []
    },
    version: {
        type: Number,
        default: 0
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('TermsAndPolicies', TermsAndPoliciesSchema);
