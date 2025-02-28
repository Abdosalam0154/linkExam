import mongoose, { Schema, Types } from "mongoose";

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        numberOfEmployees: {
            type: String,
            enum: ["1-10", "11-20", "21-50", "51-100", "101-500", "500+"],
            required: true,
        },
        companyEmail: {
            type: String,
            unique: true,
            required: true,
        },
        createdBy: [{
            type: Types.ObjectId,
            ref: "User",
            required: true,
        }],
        logo: {
            secure_url: String,
            public_id: String,
        },
        coverPic: {
            secure_url: String,
            public_id: String,
        },
        HRs: [{
            type: Types.ObjectId,
            ref: "User",
        }],
        bannedAt: {
            type: Date,
            default: null,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        legalAttachment: {
            secure_url: String,
            public_id: String,
        },
        approvedByAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const companyModel = mongoose.models.Company ||model("Company", companySchema);
