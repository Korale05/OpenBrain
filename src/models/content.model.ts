
import mongoose, { mongo } from "mongoose";
import { required } from "zod/mini";

interface ContentUI{
    link : string,
    type : string,
    title : string,
    tags :  mongoose.Types.ObjectId,
    userId : mongoose.Types.ObjectId
}
const ContentSchema = new mongoose.Schema<
    ContentUI,
    mongoose.Model<ContentUI>
>({
    link : {
        type : String
    },
    type : {
        type : String,
        enum : ['image','video','artical','audio'],
        required : true
    },
    title : {
        type : String,
        required : true
    },
    tags : {
        type : mongoose.Types.ObjectId,
        ref : "tags"
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "users",
        required : true
    }
},{timestamps : true});

export const contents = mongoose.model("contents",ContentSchema);