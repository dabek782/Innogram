import mongoose from "mongoose";

const connectDB = async (uri)=>{
    try {
      await mongoose.connect(uri!)
      console.log("connected")
    } catch (error) {
      throw console.error(error)
    }
  }
export default connectDB