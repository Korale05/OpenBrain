import { contents } from "../models/content.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request , Response } from "express";
import mongoose from "mongoose";
import { tags } from "../models/tags.model.js";

const AddnewContent = asyncHandler(async(req : Request,res : Response)=>{
    const userId = req.userId;
    if(!userId){
        new ApiError(411,"User id Required!");
    }
    const { type , link , title , taginput} = req.body;
    if(!type || !title){
        throw new ApiError(404,"Propoer Content Required !");
    }

    let tag = await tags.findOne({taginput});
    if(!tag){
        tag = await tags.create({title : taginput});
    }

    await contents.create(
        {
            link ,
            type ,
            title ,
            tags : new mongoose.Types.ObjectId(tag._id),
            userId : new mongoose.Types.ObjectId(userId)
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Content Successfully Added !"
        )
    );
})

const getallContent = asyncHandler(async(req : Request , res : Response)=>{
    const userId  = req.userId;
    

    console.log(1);
    if(!userId){
        throw new ApiError(400,"Unauthroized access To the contents !");
    }
    console.log(2)
    const content = await contents.find({
        userId : userId
    })
    console.log(3)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            content,
            "Content featched successfully !"
        )
    )
})

const deleteContent = asyncHandler(async(req : Request , res : Response)=>{

    
})
export { AddnewContent , getallContent };