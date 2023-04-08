import mongoose from "mongoose";
import bcrypt from "bcrypt"

const institutionSchema = new mongoose.Schema({
    institutionName:{
        type: String,
        required: true    
    },
    password: {
        type: String,
        required: true
      }
      // Institution.institutionName  and user.Institution should match and only then the data will be inserted
})

institutionSchema.pre('save', async function(next){
    if (this.isModified('password')){
      this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));
    }
    next();
  })

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;
