import mongoose from 'mongoose';

const SearchHistorySchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    keyword:{
        type:String,
        required:true
    }
},{timestamps: true, versionKey: false});

export default mongoose.model('SearchHistory', SearchHistorySchema);
