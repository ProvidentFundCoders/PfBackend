import mongoose from "mongoose";
import User from "./User.js";
   //previous_balance + total_contribution - total_withdrawal = total 
    //total x interest_rate/100 = interest
    // total + interest = current_balance

const schema = mongoose.Schema;

const yearSchema = new mongoose.Schema({
    uniqueID:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true    
    },
    total_contribution:{
        type:Number,
        required: true,
    },
    total_withdrawal:{
        type:Number,
        required: true,
    },
    previous_balance:{
        type:Number,
        required:false,
        default: 0,
    },
    interest:{ 
        type:Number,
        required:false,
        default: 0
    },
    current_balance:{ 
        type:Number,
        required:false,
        default: 0
    }
})

const Year = mongoose.model('YEAR', yearSchema);

export default Year;
