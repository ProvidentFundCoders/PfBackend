import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  uniqueID: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String, 
    required: true
  },
  treasury: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  institution: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function(next){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));
  }
  next();
})
const User = mongoose.model('USER', userSchema);

export default User;
