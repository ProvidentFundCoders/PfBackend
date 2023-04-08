import dbMethods from "../models/dbMethods.js";
import Month from "../models/Month.js";
import User from "../models/User.js";
import Year from "../models/Year.js";
import bcrypt from "bcrypt";

const registerUser = (req, res)=>{
 const userdata = req.body;
 const isNotExist = dbMethods.findByOne(User, {uniqueID: userdata.uniqueID})
 isNotExist.then(async (response)=>{
    if(response === false){
       const newuser = await dbMethods.create(User, userdata);
       if(newuser) res.status(201).json({...newuser._doc, success: true})
       else res.status(422).json({success:false, error: "User already existed either with same email or phone number" })
    }else{
      res.status(422).json({success:false, error: "User already exist" })
    }
 })
}

const login =  (req, res)=>{
    const userdata = req.body;
    const userfound = dbMethods.findByOne(User, {uniqueID: userdata.uniqueID})
    userfound.then(async (response)=>{
      if(response){
        const isMatch = await bcrypt.compare(userdata.password, response.password);
        console.log(isMatch)
        if(isMatch){
           res.json({... response._doc, success: true})
        }else{
         res.status(404).json({ success:false, error: "invalid cridentials" })
        }
      }else{
        res.status(404).json({success: false, error: "User not found"})
      }
    })
   }

const getAllUserData = async (req, res)=>{
  const {userid, year} = req.body;
  const userData = await dbMethods.findByOne(User, {uniqueID: userid});
  const monthData = await dbMethods.findAll(Month, {$and: [{uniqueID: userid}, {year: year}]});
  const yearData = await dbMethods.findByOne(Year, {$and: [{uniqueID: userid}, {year: year}]})
  res.json({userData, allMomths: monthData, yearData})
}

const registerController = {
    registerUser: registerUser,
    login: login,
    getAllUserData: getAllUserData
}

export default registerController;
