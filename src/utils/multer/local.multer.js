import multer from "multer"
import path from "path"
import fs from "fs"

export const fileValidation={
    image:["image/jpeg","image/png"],
    document:["application/pdf"]
}

export const uploadDiskFile=(customPath="general",fileValidation=[])=>{
    
    const basePath=`uploads/${customPath}`
    const fullPath=path.resolve(`./src/${basePath}`)
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,fullPath)
        },
        filename:(req,file,cb)=>{
            const finalFileName=Date.now()+"-"+Math.round(Math.random()*1E9)+file.originalname
            file.fileFinal=basePath+"/"+finalFileName
            cb(null,finalFileName)
        },
    })
    function fileFilter(req,file,cb){
        if(fileValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb("in-valid file format",false)
        }
    }
    return multer({dest:"tempPath",fileFilter,storage})
}
