import mongoose from "mongoose";

const connectToDatabase=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to Database');
    }catch(err){
        console.log("Error : ",err.message)
    }
}


export default connectToDatabase