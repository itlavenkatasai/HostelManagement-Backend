import mongoose from "mongoose";

const hostelOwnerSchema = new mongoose.Schema({
    Name : {type:String,required:true},
    PhoneNumber : {type:String,required : true},
    Password : {type : String,required : true},
})

export const hostelOwner = mongoose.model("HostelOwners",hostelOwnerSchema);