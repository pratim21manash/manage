import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected successfully")
    }catch(error){
        console.log("MongoDB connection error:", error.message)
        process.exit(1)
    }
}

export default connectDB;