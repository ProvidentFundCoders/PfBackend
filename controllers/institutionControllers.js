import dbMethods from "../models/dbMethods.js";
import Institution from "../models/Institution.js";
import bcrypt from "bcrypt"

const register =  (req, res)=>{
  const data = req.body;
  const isExisted  =  dbMethods.findByOne(Institution, {institutionName: req.body.instituteName});
  isExisted.then(async (response)=>{
     if(response === false){
        const newInstitute = await dbMethods.create(Institution, data);
         if(newInstitute) res.json({...newInstitute._doc, success: true})
         else res.json({success: false, error: "Some Error Occured"})
     }else{
        res.status(422).json({success:false, error: "Institution with this name  already exist!" })
     }
  })
}

const verifyInstitue = async (name, password)=>{
  const institue  =  dbMethods.findByOne(Institution, {institutionName:name});
  return institue.then(async (response)=>{
    if(response){
      const isMatch = await bcrypt.compare(password, response._doc.password);
        let result;
       (isMatch) ? result = true : result = false;
       return result;
    }else{
        return false
    } 
  })

}

const InstitutionController = {
register: register,
verifyInstitue, verifyInstitue
}

export default InstitutionController
