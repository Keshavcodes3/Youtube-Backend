import jwt from "jsonwebtoken";

export const IdentifyUser=async(req,res,next)=>{
    let decoded;
    const token=req.cookies.token;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        console.log(err)
    }
    req.user=decoded
    next()
}