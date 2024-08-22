import { hostelOwner } from "../models/index.js";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";

export const loginHostelOwner = async (req,res)=>{
   try{
    const {PhoneNumber,Password} = req.body;

    const existingUser = await hostelOwner.findOne({PhoneNumber});
    if(!existingUser){
        return res.status(400).json({
            message:"Invalid PhoneNumber or Password please register"
        })
    }
    const isPasswordMatch = await bcrypt.compare(Password,existingUser.Password);
    console.log(isPasswordMatch);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"please enter valid password"
        })
    }
    const {TOKEN_SECRET, TOKEN_EXPIRES_IN} = process.env;
    const token = Jwt.sign({PhoneNumber,ClientId: existingUser._id},TOKEN_SECRET,{expiresIn: TOKEN_EXPIRES_IN});
    return res.status(200).json({
        message:"token created sucessfully",
        data: token
    })
   }catch(error){
    console.log(error);
    return res.status(500).json({
        message:"something went wrong please try again"
    })
   }
}