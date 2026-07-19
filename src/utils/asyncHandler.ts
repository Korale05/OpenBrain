import type { NextFunction , Request , Response } from "express";
import { ApiError } from "./apiError.js";


const asyncHandler = (
    fn : (
            req : Request,
            res : Response,
            next : NextFunction
        ) => Promise<any>
    )=> async(
        req : Request,
        res : Response,
        next : NextFunction)=>{

        try {
            await fn(req,res,next);
        }catch(error){

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    errors: error.errors
                });
            }

            return res.status(500).json({
                success : false,
                message : error instanceof Error ? error.message : String(error),
                error : error
            });
        }
}


export { asyncHandler }