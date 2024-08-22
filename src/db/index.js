import mongoose from "mongoose";

export const dbConnectedWithMongo = async ()=>{
    try{
        const {MONGO_URL} = process.env;
        await mongoose.connect(MONGO_URL);
        console.log("node is connected to MongoDB")
    }catch(error){
        console.log("Db is not connected to node")
        console.log(error)
    }
}
