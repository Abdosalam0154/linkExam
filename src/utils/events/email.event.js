import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.js";
import { emailSubject } from "../../DB/model/Enum.js";
import * as dbService from "../../DB/db.Service.js"
import { verifyOTPtemplate } from "../email/template/verifyOTPtemplate.js";
import { sendEmail } from "../email/send.email.js";
import { userModel } from "../../DB/model/User.model.js";

export const emailEvent=new EventEmitter()

export const sendCode=async({data={},subject}={})=>{
    const {email,id}=data
    const otp = customAlphabet("0123456789",6)()
    const HashOTP=generateHash({plaintext:otp})
    const changeCredentialsTime=Date.now()+10*60*1000
    let updateData={changeCredentialsTime}
    switch (subject) {
        case emailSubject.confirmEmail:
            updateData={...updateData,confirmEmailOTP:HashOTP}
            break;
        case emailSubject.forgotPassword:
            updateData={...updateData,forgotPasswordOTP:HashOTP}
            break;
        case emailSubject.updateEmail:
            updateData={...updateData,updateEmailOTP:HashOTP}
            break;
        default:
            break;
    }
    await dbService.updateOne({model:userModel,filter:{_id:id},data:updateData})
    const html =await verifyOTPtemplate({code:otp})
    await sendEmail({to:email,subject,html})
}

emailEvent.on("confirmEmail",async(data)=>{
    await sendCode({data,subject:emailSubject.confirmEmail})
})
emailEvent.on("updateEmail",async(data)=>{
    await sendCode({data,subject:emailSubject.updateEmail})
})
emailEvent.on("forgotPassword",async(data)=>{
    await sendCode({data,subject:emailSubject.forgotPassword})
})