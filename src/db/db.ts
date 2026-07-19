
import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

console.log(process.env.MONGODB_URL);
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MongoDB connected !! DB Host : ${conn.connection.host}`)
    }catch(error){
        console.log("MongoDb connection failed : ",error);
        process.exit(1);
    }
}

export default connectDB;