import dbMethods from "../models/dbMethods.js";
import InstitutionController from "./institutionControllers.js";
import Month from "../models/Month.js";
import Year from "../models/Year.js";
import mongoose from "mongoose";

const interestRate = 7.1;
let totalNumberofMonth;

const insertData = async (req, res) => {
  const verifiedInstitute = await InstitutionController.verifyInstitue(
    req.body.instituteName,
    req.body.password
  );

  if (verifiedInstitute) {
    const {
      userid,
      year,
      month,
      contribution,
      withdrawal,
      other,
      type_of_other,
      remark,
    } = req.body;

    const isMonthExist = await isMonthExisted(month, userid, year);
    if (isMonthExist === false) {
      const monthData = {
        uniqueID: userid,
        year,
        month,
        contribution,
        withdrawal,
        other,
        type_of_other,
        remark,
        verified: false,
      };
      const record = await addFundata(monthData);
      if(record){
        if(month === "March"){
          insertYearRecord(req.body)
        }
        res.json({success: true, ... record._doc});
      }else{
        res.json({success: false, error: "Unknown error"})
      }
      
    } else {
      res.json({
        success: false,
        error: `The contribution for month ${month} is already done. Use update button to update a month record.`,
      });
    }
  } else {
    res.json({ success: false, error: "Not a verified Institute" });
  }
};

const insertYearRecord = async (userdata) => {
  let prev_balance;
  if(userdata.year === process.env.START_YEAR){
     prev_balance = userdata.previous_contribution;
  }else{
    prev_balance = await previousYearBalance(userdata.year);
  }
  let others = await totalField("other", userdata.year, userdata.userid);
  let total_contribution = await totalField("contribution",userdata.year, userdata.userid)+ others;
  let total_withdrawal =await totalField("withdrawal",userdata.year, userdata.userid);
  let total = prev_balance+total_contribution-total_withdrawal;
  let interest = ((total*interestRate)/100)/totalNumberofMonth;
  let current_balance = total+interest;

 const yearData = {
  uniqueID: userdata.userid,
  year: userdata.year,
  total_contribution,
  total_withdrawal,
  previous_balance: prev_balance,
  interest,
  current_balance
 }
 const newYearData = await dbMethods.create(Year, yearData);

};

const isMonthExisted = async (iMonth, userid, iYear) => {
  const exist = await dbMethods.findByOne(Month, {$and: [{uniqueID: userid}, {year: iYear},  {month: iMonth}]});
    return exist;
};

const addFundata = async (data) => {
  const newData = await dbMethods.create(Month, data);
  if (newData) return newData;
  else return false;
};

const totalField = async (fieldName,year, userid)=>{
  const findFields = await dbMethods.findAll(Month, {$and: [{year: year}, {uniqueID: userid}]});

  let total = 0;
  for (let i = 0; i < findFields.length; i++) {
     total += findFields[i][fieldName];
  }
  totalNumberofMonth = findFields.length;
   return total;
}

const previousYearBalance = async (year)=>{
  const prev_year = parseInt(year.slice(0,4))-1;
  const currentYear = year.slice(2,4)
  const previousYearDuration= prev_year+"-"+ currentYear;
  const prevYearData = await dbMethods.findByOne(Year, {year: previousYearDuration})
  return prevYearData.current_balance;
}

const updateFundData = async (req, res)=>{
  const data = {... req.body};
  const update = await dbMethods.updateOneRecord(Month,{month: req.body.month}, {... req.body})
  res.json(update)
}

const pfControllers = {
  insertData: insertData,
  updateFundData: updateFundData
};

export default pfControllers;