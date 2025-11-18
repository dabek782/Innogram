import mongoose, { Schema , model, connect } from "mongoose";
interface User  {
  name:String,
  email:String,
  password:String,
  createdAt:Number
}
const UserSchema = new Schema({
  name :({
    type:String,
    required:true
  }),
  email:({
    type:String ,
    required:true
  }),
  createdAt:({
    type:Number,
    Date: Date.now
  }
  ),
  password:({
    type:String,
    required:true
  })

})
const UserModel = mongoose.model('User' , UserSchema)

export default UserModel