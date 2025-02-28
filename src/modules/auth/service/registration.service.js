import { asyncHandler } from "../../../utils/response/error.response.js";
import * as dbService from "../../../DB/db.Service.js"
import { compareHash, generateHash } from "../../../utils/security/hash.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { userModel } from "../../../DB/model/User.model.js";
import { generateEncryption } from "../../../utils/security/encryption.js";


export const signup = asyncHandler(async(req,res,next)=>{
    const {firstname,lastname,email,password,mobileNumber}=req.body
    if(await dbService.findOne({model:userModel,filter:{email}})){
        return next(new Error("Email Exist",{cause:409}))
    }
    const user = await dbService.create({model:userModel,data:{firstname,lastname,email,
        password:generateHash({plaintext:password}),mobileNumber:generateEncryption({plaintext:mobileNumber})}})
    emailEvent.emit("confirmEmail",{id:user._id,email})
    return successResponse({res,status:201,message:"signUp",data:{user}})
})
export const confirmEmail = asyncHandler(async(req,res,next)=>{
    const {email,code}=req.body
    const user=await dbService.findOne({model:userModel,filter:{email}})
    if(!user){
        return next(new Error("in-valid user account",{cause:404}))
    }
    if(user.confirmed){
        return next(new Error("Aready verified",{cause:409}))
    }
    if(!compareHash({plaintext:code,hashvalue:user.confirmEmailOTP})){
        return next(new Error("in-valid code",{cause:409}))
    }
    await dbService.updateOne({model:userModel,filter:{_id:user._id},data:{confirmed:true,$unset:{confirmEmailOTP:0}}})
    return successResponse({res,message:"confirmed"})
})
