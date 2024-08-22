import { hostelOwner } from "../models/index.js";
import bcrypt from 'bcrypt';

export const hostelOwnerRegister = async (req,res)=>{
    try{
        const {Name,PhoneNumber,Password} = req.body;
    const existingPhoneNumber = await hostelOwner.findOne({PhoneNumber});
    if(existingPhoneNumber){
        return res.status(409).json({
            message:"This Phone Number is already exist please enter another number or login"
        })
    }
    const hashedPassword = await bcrypt.hash(Password,10);
    const owner = {Name,PhoneNumber,Password : hashedPassword};
    const registerOwner = await hostelOwner.create(owner);
    return res.status(200).json({
        message:"hostel Owner register sucessfully",
        data: registerOwner
    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"something went wrong please try again"
        })
    }
}