import { asyncHandler } from "../../../utils/response/error.response.js";
import * as dbService from "../../../DB/db.Service.js"
import { compareHash, generateHash } from "../../../utils/security/hash.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { userModel } from "../../../DB/model/User.model.js";
import {  decodedToken, generateToken, verifyToken } from "../../../utils/security/token.js";
import { providerTypes, roleTypes, tokenTypes } from "../../../DB/model/Enum.js";
import { OAuth2Client } from 'google-auth-library';
import { emailEvent } from "../../../utils/events/email.event.js";



export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await dbService.findOne({ model: userModel, filter: { email ,provider:providerTypes.system } })
    if (!user) {
        return next(new Error("in-valid user account", { cause: 404 }))
    }
    if (!user.confirmed) {
        return next(new Error("please verified account first", { cause: 400 }))
    }
    if (!compareHash({ plaintext: password, hashvalue: user.password })) {
        return next(new Error("in-valid user account", { cause: 404 }))
    }
    const access_signature = generateToken({
        payload: { id: user._id },
        signature: user.role == roleTypes.user ?
            process.env.ACCESS_TOKEN_USER : process.env.ACCESS_TOKEN_ADMIN
    })
    const refresh_signature = generateToken({
        payload: { id: user._id },
        signature: user.role == roleTypes.user ?
            process.env.REFRESH_TOKEN_USER : process.env.REFRESH_TOKEN_ADMIN,
        options: { expiresIn: 31536000 }
    })
    return successResponse({
        res, message: "login", data: {
            token: { access_signature, refresh_signature }
        }
    })
})
export const loginWithGmail = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body

    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload
    }
    const payload = await verify()
    if (!payload.email_verified) {
        return next(new Error("in-valid account", { cause: 404 }))
    }
    const user=await dbService.findOne({model:userModel,filter:{email:payload.email}})
    if(!user){
        await dbService.create({model:userModel,data:{
            firstname:payload.firstname,
            lastname:payload.lastname,
            username:payload.name,
            email:payload.email,
            confirmed:payload.email_verified,
            image:payload.picture,
            provider:providerTypes.google
        }})
    }
    
    if(user.provider!=providerTypes.google){
        return next(new Error("in-valid provider",{cause:400}))
    }

    const access_signature=generateToken({
        payload:{id:user._id},
        signature:user.role==roleTypes.user?
        process.env.ACCESS_TOKEN_USER:process.env.ACCESS_TOKEN_ADMIN
    })
    const refresh_signature=generateToken({
        payload:{id:user._id},
        signature:user.role==roleTypes.user?
        process.env.REFRESH_TOKEN_USER:process.env.REFRESH_TOKEN_ADMIN,
        options:{expiresIn:31536000}
    })
    return successResponse({
        res, message: "login", data: {
            token: { access_signature, refresh_signature }
            
        }
    })
})
export const refreshToken=asyncHandler(async(req,res,next)=>{
    const {authorization}=req.headers
    const user =await decodedToken({authorization,tokenType:tokenTypes.refresh,next})
    const access_signature = generateToken({
        payload: { id: user._id },
        signature: user.role == roleTypes.user ?
            process.env.ACCESS_TOKEN_USER : process.env.ACCESS_TOKEN_ADMIN
    })
    const refresh_signature = generateToken({
        payload: { id: user._id },
        signature: user.role == roleTypes.user ?
            process.env.REFRESH_TOKEN_USER : process.env.REFRESH_TOKEN_ADMIN,
        options: { expiresIn: 31536000 }
    })
    return successResponse({
        res, data: {
            token: { access_signature, refresh_signature }
        }
    })
})

export const forgotPassword = asyncHandler(async(req,res,next)=>{
    const {email}=req.body
    const user=await dbService.findOne({model:userModel,filter:{email}})
    if(!user){
        return next(new Error("in-valid user account",{cause:404}))
    }
    if(!user.confirmed){
        return next(new Error("please verified account first",{cause:409}))
    }
    emailEvent.emit("forgotPassword",{id:user._id,email})
    return successResponse({res})
})
export const verifiedforgotPassword = asyncHandler(async(req,res,next)=>{
    const {email,code}=req.body
    const user=await dbService.findOne({model:userModel,filter:{email}})
    if(!user){
        return next(new Error("in-valid user account",{cause:404}))
    }
    if(!user.confirmed){
        return next(new Error("please verified account first",{cause:409}))
    }
    if(!compareHash({plaintext:code,hashvalue:user.forgotPasswordOTP})){
        return next(new Error("in-valid code",{cause:409}))
    }
    if(user.changeCredentialTime<=Date.now()){
        return successResponse({res,status:400,message:"expires code"})
    }
})
export const resetPassword = asyncHandler(async(req,res,next)=>{
    const {email,password,code}=req.body
    const user=await dbService.findOne({model:userModel,filter:{email}})
    if(!user){
        return next(new Error("in-valid user account",{cause:404}))
    }
    if(!user.confirmed){
        return next(new Error("please verified account first",{cause:409}))
    }
    if(!compareHash({plaintext:code,hashvalue:user.forgotPasswordOTP})){
        return next(new Error("in-valid code",{cause:409}))
    }
    if(compareHash({plaintext:password,hashvalue:user.password})){
        return next(new Error("change old-Password ",{cause:409}))
    }
    if(user.changeCredentialTime<=Date.now()){
        return successResponse({res,status:400,message:"expires code"})
    }
    await dbService.updateOne({model:userModel,filter:{email},
        data:{password:generateHash({plaintext:password}),
        changeCredentialTime:Date.now(),
        $unset:{forgotPasswordOTP:0}}})
    return successResponse({res})
})

