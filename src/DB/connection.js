import mongoose from "mongoose"


export const connectionDB=async(req,res,next)=>{
    await mongoose.connect(process.env.DB_URL).then(res=>{console.log("connected");
    }).catch(err=>{console.log("fail",err);
    })
}