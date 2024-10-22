import mongoose from 'mongoose'

const StatisticalSchema = new mongoose.Schema({
    shoes:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoes',
        required: true
    },
    sales:{
        type: Number,
        default: 0
    },
    revenue:{
        type: Number,
        default: 0
    }
},{timestamps: true, versionKey: false});

export default mongoose.model('Statistical', StatisticalSchema);
