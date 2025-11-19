import UserModel from "./auth"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
import * as jose from 'jose'

export const register = async (req,res)=>{
  try {
    const {name , email , password}  = req.body
    const ExistingUser = await UserModel.findOne({email})
    if(ExistingUser){
      return res.status(401).json({message : "User with that email found in our database"})
    }
    const createUser = UserModel.create({name , email , password})
    const userToken = jwt.sign({id:UserModel._id} ,jose.generateSecret('hs256') )
  } catch (error) {
    
  }
}