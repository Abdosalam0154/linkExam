

import nodemailer from "nodemailer";
export const sendEmail = async ({to="",cc="",bcc="",text="",html="",subject=""}={}) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


        const info = await transporter.sendMail({
            from: `"El-Salam Group 👻" <${process.env.EMAIL}>`, // sender address
            to,cc,bcc,text,html,subject
        });
        return info

}