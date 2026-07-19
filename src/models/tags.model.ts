
import mongoose from "mongoose";
import { string } from "zod";


const tagSchema = new mongoose.Schema(
    {
        title : string
    },
    {timestamps : true}
)

export const tags = mongoose.model("tags",tagSchema);