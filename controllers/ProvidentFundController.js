import dbMethods from "../models/dbMethods.js";
import InstitutionController from "./institutionControllers.js";
import Month from "../models/Month.js";
import Year from "../models/Year.js";
import mongoose from "mongoose";

const interestRate = 7.1;

const insertData = async (req, res) => {
  const verifiedInstitute = await InstitutionController.verifyInstitue(
    req.body.instituteName,
    req.body.password
  );

  if (verifiedInstitute) {
    const {
      userID,
      year,
      month,
      contribution,
      withdrawal,
      other,
      type_of_other,
      remark,
    } = req.body;

    const isMonthExist = await isMonthExisted(month, userID, year);
    if (isMonthExist === false) {
      const monthData = {
        uniqueID: userID,
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
        res.json({success: false, error: "Error: Record Not Inserted"})
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
     console.log(prev_balance)
  }else{
    prev_balance = await previousYearBalance(userdata.year);
  }
  let others = await totalField("other", userdata.year, userdata.userID);
  let total_contribution = await totalField("contribution",userdata.year, userdata.userID)+ others;
  let total_withdrawal =await totalField("withdrawal",userdata.year, userdata.userID);
  let total = prev_balance+total_contribution-total_withdrawal;
  console.log(total+ " "+ interestRate)
  let interest = total*(interestRate/100);
  console.log(interest);
  let current_balance = total+interest;

 const yearData = {
  uniqueID: userdata.userID,
  year: userdata.year,
  total_contribution,
  total_withdrawal,
  previous_balance: prev_balance,
  interest,
  current_balance
 }

 console.log(yearData);
 const newYearData = await dbMethods.create(Year, yearData);

};

const isMonthExisted = async (iMonth, userID, iYear) => {
  const exist = await dbMethods.findByOne(Month, {$and: [{uniqueID: userID}, {year: iYear},  {month: iMonth}]});
    return exist;
};

const addFundata = async (data) => {
  const newData = await dbMethods.create(Month, data);
  if (newData) return newData;
  else return false;
};

const totalField = async (fieldName,year, userID)=>{
  const findFields = await dbMethods.findAll(Month, {$and: [{year: year}, {uniqueID: userID}]});

  let total = 0;
  for (let i = 0; i < findFields.length; i++) {
     total += findFields[i][fieldName];
  }
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
