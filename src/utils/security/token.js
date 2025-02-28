import jwt from "jsonwebtoken";
import { tokenTypes } from "../../DB/model/Enum.js";
import * as dbSevice from "../../DB/db.Service.js"
import { userModel } from "../../DB/model/User.model.js";


export const decodedToken=async({authorization={},tokenType=tokenTypes.access,next={}}={})=>{
    const [bearer,token]=authorization?.split(" ")
    if(!bearer||!token){
        return next(new Error("in-valid token",{cause:400}))
    }
    let access_signature=""
    let refresh_signature=""
    switch (bearer) {
        case "system":
            access_signature=process.env.ACCESS_TOKEN_ADMIN
            refresh_signature=process.env.REFRESH_TOKEN_ADMIN
            break;
        case "Bearer":
            access_signature=process.env.ACCESS_TOKEN_USER
            refresh_signature=process.env.REFRESH_TOKEN_USER
            break;
        default:
            break;
    }
    const decoded=verifyToken({token,signature:tokenType==tokenTypes.access?access_signature:refresh_signature})
    if(!decoded?.id){
        return next(new Error("in-valid token Payload",{cause:400}))
    }
    const user= await dbSevice.findOne({model:userModel,filter:{_id:decoded.id}})
    if(!user){
        return next(new Error("in-valid user account",{cause:404}))
    }
    if(!user.changeCredentialTime?.getTime()>=decoded.iat*1000){
        return next(new Error("in-valid Credentials",{cause:404}))
    }
    return user
}


export const generateToken = ({ payload = {}, signature = process.env.SIGNATURE_TOKEN, expiresIn = process.env.EXPIRESIN } = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) })
    return token
}
export const verifyToken = ({ token = {}, signature = process.env.SIGNATURE_TOKEN } = {}) => {
    const decoded = jwt.verify(token, signature)
    return decoded
}
