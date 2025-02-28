

import mongoose, { model, Schema, Types } from "mongoose";
import {  genderTypes, providerTypes, roleTypes } from "./Enum.js";


export const userSchema=new Schema({
    firstname:{type:String,minlength:5,maxlength:500,trim:true},
    lastname:{type:String,minlength:5,maxlength:500,trim:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:(data)=>{
        return data?.provider==providerTypes.google?false:true
    }},
    provider:{type:String,enum:Object.values(providerTypes),default:providerTypes.system},
    gender:{type:String,enum:Object.values(genderTypes),default:genderTypes.male},
    role:{type:String,enum:Object.values(roleTypes),default:roleTypes.user},
    DOB:Date,
    mobileNumber:String,
    confirmed:{type:Boolean,default:false},
    deletedAt:Date,
    bannedAt:Date,
    updatedBy:{type:Types.ObjectId,ref:"User"},
    changeCredentialTime:Date,
    confirmEmailOTP:String,
    forgotPasswordOTP:String,
    tempEmail:String,
    updateEmailOTP:String,
    viewers:[{
        userId:{type:Types.ObjectId,ref:"User"},
        time:Date
    }]
},{timestamps:true})
export const userModel=mongoose.models.User||model("User",userSchema)