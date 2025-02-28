import  mongoose, { Schema, Types } from "mongoose";

const JobopportunitySchema = new Schema(
    {
        jobTitle: {
            type: String,
            required: true,
        },
        jobLocation: {
            type: String,
            enum: ["onsite", "remotely", "hybrid"],
            required: true,
        },
        workingTime: {
            type: String,
            enum: ["part-time", "full-time"],
            required: true,
        },
        seniorityLevel: {
            type: String,
            enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead"],
            required: true,
        },
        jobDescription: {
            type: String,
            required: true,
        },
        technicalSkills: [{
            type: String,
            required: true,
        }],
        softSkills: [{
            type: String,
            required: true,
        }],
        addedBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "User",
        },
        closed: {
            type: Boolean,
            default: false,
        },
        companyId: {
            type: Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    { timestamps: true }
);

export const jobModel = mongoose.models.JobOpportunity ||model("JobOpportunity", JobopportunitySchema);
