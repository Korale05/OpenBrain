import { isAccessExpression } from "typescript/unstable/ast";
import { users } from "../models/users.model.js";
import { registerSchema } from "../schemas/register.schema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { CookieOptions, Request , Response } from "express";


interface IUserPayload extends JwtPayload {
    _id : string
}




const option_accessToken : CookieOptions = {
    httpOnly : true,
    secure : true,
    sameSite : "strict",
    maxAge : 15 * 60 * 1000  //15min
}

const option_refreshToken : CookieOptions = {
    httpOnly : true,
    secure : true,
    sameSite : "strict",
    maxAge : 7 * 24 * 60 * 60 * 1000  // 7 days
}

const generateRefreshAndAccessToken = async(userId : string)=>{

    const user = await users.findById(userId);

    if(!user){
        throw new ApiError(404,"User not found !");
    }
    const accessToken : string = user.generateAccessToken();
    const refreshToken : string = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return { accessToken , refreshToken};
}
const register = asyncHandler(async(req : Request,res : Response)=>{
    
    const result = registerSchema.safeParse(req.body);

    if(!result.success){

        console.log(result.error.format());
        throw new ApiError(400,"Invalid Input body !");
    }

    const { username , password } = req.body;

    const alreadyUser = await users.findOne({
        username
    });

    if(alreadyUser){
        throw new ApiError(400,"Username already Exits ! Take Different One");
    }

    await users.create(
        {
            username,
            password
        }
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Successfully Registered !")
    )

});

const login = asyncHandler(async(req : Request,res : Response)=>{

    const result = registerSchema.safeParse(req.body);

    if(!result.success){
        throw new ApiError(411,"Invalid Input body !");
    }

    const { username , password } = req.body;
    
    const user = await users.findOne({username});

    if(!user){
        throw new ApiError(404,"User Does not exits !");
    }
    const isPasswordCorrect = user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400,"Password Is Wrong !");
    }

    const { accessToken  , refreshToken } = await generateRefreshAndAccessToken(user._id.toString());

    return res
    .cookie("access-token",accessToken,option_accessToken)
    .cookie("refresh-token",refreshToken,option_refreshToken)
    .json(
        new ApiResponse(
            200,
            {   
                username,
                accessToken,
                refreshToken
            },
            "Successfully Login !"
        )
    )

})

const logout = asyncHandler(async(req : Request , res : Response)=>{
    const userId : string = req?.userId!;
    
    await users.findByIdAndUpdate(userId,
        {
            $set : {
                refreshToken : null
            }
        }
    )
    return res
    .status(200)
    .clearCookie("access-token")
    .clearCookie("refresh-token")
    .json(
        new ApiResponse(
            200,
            {},
            "Logout Successfully !"
        )
    )

})


// if our access TOken is expired we can generate once again access TOkena and refresh TOken 
const refreshToken = asyncHandler(async(req : Request,res : Response)=>{
    
    const CommingRefreshToken = req.cookies['refresh-token'];
    

    const decode = jwt.verify(CommingRefreshToken,process.env.JWT_REFRESH_SECRET!) as IUserPayload;

    console.log(decode);

    if(!decode){
        throw new ApiError(411,"Invalid Token !");
    }

    const user = await users.findById(decode._id);
    if(!user){
        throw new ApiError(404,"User not found !");
    }

    const accessToken : string = user.generateAccessToken();
    const new_refreshToken : string = user.generateRefreshToken();

    user.refreshToken = new_refreshToken;
    await user.save();
    
    return res
    .status(200)
    .cookie("access-token",accessToken,option_accessToken)
    .cookie("refresh-token",new_refreshToken,option_refreshToken)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                new_refreshToken
            },
            "Successfully Updated the refresh TOken"
        )
    )
})


export { register , login , logout , refreshToken };