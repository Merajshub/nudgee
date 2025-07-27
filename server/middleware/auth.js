import jwt from 'jsonwebtoken'
import User from '../models/User.js';


export const protectRoute = async(req,res,next)=>{
// verify token
try{const token = req.headers;
const decode = jwt.verify(token,process.env.SECRETE)

const user = User.findById(decode.userId).select("-password");

if(!user){
    res.json({
        success : false,
        message :' User not found'
    })
    req.user = user
    next()
}}catch(error){
    res.json({
        success : false,
        message :' Authorization failed'
    })
   
}
}