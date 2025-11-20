import mongoose, { Schema , model, connect } from "mongoose";
import bcrypt from "bcryptjs"
import { MessagePort } from "node:worker_threads";
interface User  {
  name:String,
  email:String,
  password:String,
  createdAt:Number, 
}
const UserSchema = new Schema<User>({
  name :({
    type:String,
    required:true,
    unique:true
  }),
  email:({
    type:String ,
    required:true,
    unique:true

  }),
  createdAt:({
    type:Number,
    Date: Date.now
  }
  ),
  password:({
    type:String,
    required:true,
    minlength : 6
  })

})


UserSchema.pre("save" , async function(next) {
  if(!this.isModified('password')) return next
  this.password = await bcrypt.hash(this.password as string, 16)
  return next
  
} )
 UserSchema.methods.isValidPassword = async function(givenPassword) {
 try {
   return bcrypt.compare(givenPassword , this.password)
 } catch (error) {
     return console.error(error)
    }
}
const UserModel = mongoose.model('User' , UserSchema)
export default UserModel