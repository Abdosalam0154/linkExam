import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from "../../../DB/db.Service.js"
import { userModel } from "../../../DB/model/User.model.js";
import { generateDecryption } from "../../../utils/security/encryption.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { compareHash } from "../../../utils/security/hash.js";
export const profile=asyncHandler(async(req,res,next)=>{
    const user=await dbService.findOne({model:userModel,filter:{_id:req.user._id},populate:[{path:"viewers.userId"}]})
    return successResponse({res,data:{user}})
})
export const shareProfile=asyncHandler(async(req,res,next)=>{
    const {profileId}=req.params
    let user=""
    if(profileId===req.user._id.toString()){
        user=req.user
    }
    else{
        user=await dbService.findOneAndUpdate({model:userModel,filter:{_id:profileId},data:{
            $push:{viewers:{userId:req.user._id,time:Date.now()}}
        },select:"firstname lastname email image"
    })
    }

    return user?successResponse({res,data:{user}}):next(new Error("in-valid user",{cause:404}))
})

export const updateEmail=asyncHandler(async(req,res,next)=>{
    const {email}=req.body
    if(await dbService.findOne({model:userModel,filter:{email}})){
        return next(new Error("Email Already Exist",{cause:409}))
    }
    await dbService.updateOne({model:userModel,filter:{_id:req.user._id},data:{tempEmail:email}})
    emailEvent.emit("confirmEmail",{id:req.user._id,email:req.user.email})
    emailEvent.emit("updateEmail",{id:req.user._id,email})
    return successResponse({res})
})
export const resetEmail=asyncHandler(async(req,res,next)=>{
    const {oldcode,newcode}=req.body
    if(
        !compareHash({plaintext:oldcode,hashvalue:req.user.confirmEmailOTP})
        ||
        !compareHash({plaintext:newcode,hashvalue:req.user.updateEmailOTP})

    ){
        return next(new Error("in-valid codes",{cause:400}))
    }
    await dbService.updateOne({model:userModel,filter:{_id:req.user._id},data:{
        email:req.user.tempEmail,
        changeCredentialTime:Date.now(),
        $unset:{
            confirmEmailOTP:0,
            updateEmailOTP:0,
            tempEmail:0
        }
        
    }})

    return successResponse({res})
})
export const updatePassword = asyncHandler(async (req, res, next) => {
    const {oldPassword,password}=req.body
    if(
        !compareHash({plaintext:oldPassword,hashvalue:req.user.password})
    ){
        return next(new Error("in-valid oldPassword",{cause:400}))
    }
    
    await dbService.updateOne({model:userModel,filter:{_id:req.user._id},data:{
        password:generateHash({plaintext:password}),
        changeCerdentialsTime:Date.now(),
        
    }})
    return successResponse({ res })
})
export const updateProfile = asyncHandler(async (req, res, next) => {
    const user=await dbService.findOneAndUpdate({model:userModel,filter:{_id:req.user._id},data:req.body,options:{new :true}})
    return successResponse({ res,data:{user} })
})
export const uploadFile = asyncHandler(async (req, res, next) => {
    const user=await dbService.findOneAndUpdate({model:userModel,filter:{_id:req.user._id},data:{image:req.user.file},options:{new :true}})
    return successResponse({ res,data:{file:req.file} })
})
export const uploadFileCover = asyncHandler(async (req, res, next) => {
    const user=await dbService.findOneAndUpdate({model:userModel,filter:{_id:req.user._id},data:{coverImage:req.files.map(file=>file.fileFinal)},options:{new :true}})
    return successResponse({ res,data:{file:req.files} })
})
