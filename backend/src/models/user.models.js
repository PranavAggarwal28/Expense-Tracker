import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
  username:{
    type:String,
    required:[true,"username is required"],
    unique:true,
    lowercase:true,
    trim:true,
    
  },
  email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    lowercase:true,
    trim:true
  },
  fullname:{
    type:String,
    required:[true,"full name is required"],
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required"]
  },
  

},{timestamps:true})
// below is password hashing using bcrypt
userSchema.pre("save",async function (next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10)
  next();
})

// comparing passwords
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password,this.password)
}




export const User = mongoose.model("User",userSchema);