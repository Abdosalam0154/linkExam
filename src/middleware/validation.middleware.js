import joi from "joi"
import { Types } from "mongoose"

export const isValidationObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("in-valid id")
}


export const generalFields = {
    firstname: joi.string().trim().min(5).max(500),
    lastname: joi.string().trim().min(5).max(500),
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["com", "edu"] } }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword:joi.string(),
    mobileNumber: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    code: joi.string().pattern(new RegExp(/^\d{6}$/)),
    id: joi.string().custom(isValidationObjectId)
}

export const validation = (schema) => {
    return (req, res, next) => {
        const inputdata = { ...req.body, ...req.params, ...req.query }
        const validationResult = schema.validate(inputdata, { abortEarly: false })
        if (validationResult.error) {
            return res.status(400).json({message:"validation error",details:validationResult.error.details})
        }
        return next()
    }
}