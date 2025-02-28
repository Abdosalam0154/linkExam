import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const shareProfileValidation = joi.object().keys({
    profileId: generalFields.id.required()
}).required()
export const updateEmailValidation = joi.object().keys({
    email: generalFields.email.required()
}).required()
export const resetEmailValidation = joi.object().keys({
    oldcode: generalFields.code.required(),
    newcode: generalFields.code.required(),
}).required()
export const updatePasswordValidation = joi.object().keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmPassword: generalFields.confirmPassword.valid(joi.ref("password")).required(),
}).required()
export const updateProfileValidation = joi.object().keys({
    firstname: generalFields.firstname.required(),
    lastname: generalFields.lastname.required(),
    mobileNumber: generalFields.mobileNumber.required()
}).required()