import Month from "../models/Month.js";
import dbMethods from "../models/dbMethods.js";

const verifyUserData = async (req,res)=>{
 const {month, year, userID} = req.body;
 const update = await dbMethods.updateOneRecord(Month,{month: month, year: year, uniqueId: userID}, {verified: true});
 if(update){
    res.json({updated: true})
 }else{
    res.json({updated: false})
 }
}

const unverifiedMessage = async (req, res)=>{
    const {month, year, userID, message} = req.body;
    const update = await dbMethods.updateOneRecord(Month,{month: month, year: year, uniqueId: userID}, {notVerifiedReason: message});
    if(update){
       res.json({updated: true})
    }else{
       res.json({updated: false})
    }
}

const roControllers = {
    verifyUserData,
    unverifiedMessage
}

export default roControllers;
