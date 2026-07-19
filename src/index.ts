
import app from "./app.js";
import connectDB from "./db/db.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

connectDB()
.then(()=>{

    const server = app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`Server is Running Successfully  ${process.env.PORT}`);
    })

    server.on("error",(error)=>{
        console.log("Server error : ",error);
    })

})
.catch((err)=>{
    console.log("Mongo db Connection failded !!!",err);
})