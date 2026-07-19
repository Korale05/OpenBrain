

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction , Request , Response } from "express";

interface IUserPayload extends JwtPayload{
    _id : string
}

const Protect = asyncHandler(async(req : Request,res : Response,next : NextFunction)=>{

    const accessToken = req.cookies['access-token'];

    const decode = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET!) as IUserPayload;

    if(!decode){
        throw new ApiError(400,"Invalid Token !");
    }
    req.userId = decode._id;
    next();
})

export default Protect;