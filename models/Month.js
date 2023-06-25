import mongoose from "mongoose";
import Year from "./Year.js";
import User from "./User.js";

const schema = mongoose.Schema;

const monthSchema = new mongoose.Schema({
    uniqueID:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    month:{
        type: String,  
        required: true
    },
    contribution:{
        type: Number,
        required: false
    },
    withdrawal:{
        type: Number,
        required: false
    },
    other:{
        type: Number,
        required: false
    },
    type_of_other:{
        type: String,
        required: false
    },
    remark:{
        type: String,
        required: false
    },
    verified:{
        type: Boolean,
        required: false,
    },
    notVerifiedReason: {
        type: String,
        required: false
    }
})

const Month = mongoose.model('month', monthSchema);

export default Month;
