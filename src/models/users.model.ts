

import mongoose, { mongo } from "mongoose";
import { required } from "zod/mini";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserI {
    username : string,
    password : string,
    refreshToken : string
}

interface Usermethods {
    isPasswordCorrect(password : string) : Promise<boolean>,
    generateAccessToken() : string,
    generateRefreshToken() : string
}


const usersSchema = new mongoose.Schema<
    UserI,
    mongoose.Model<UserI>,
    Usermethods
>(
    {
        username : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true
        },
        refreshToken : {
            type : String
        }
    },{timestamps : true}
)

//mongodb hooks

//before saving into users model it run this function if password is inserted it hash the password and then inserted
usersSchema.pre("save",async function(){
    if(this.isModified("password")) 
        this.password = await bcrypt.hash(this.password,10);
})
usersSchema.methods.isPasswordCorrect = async function(password : string){
    return await bcrypt.compare(password,this.password);
}

usersSchema.methods.generateAccessToken = function () {
    return jwt.sign({username: this.username,_id : this._id.toString()},process.env.JWT_ACCESS_SECRET!,{expiresIn : "15m"});
}

usersSchema.methods.generateRefreshToken = function (){
    return jwt.sign({username : this.username , _id :this._id.toString()},process.env.JWT_REFRESH_SECRET!,{expiresIn : "7d"});
}

export const users = mongoose.model("users",usersSchema);
