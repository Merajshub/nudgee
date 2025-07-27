import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcryptjs from 'bcryptjs'

export const signup = async(req,res)=>{
    const {email,fullName,password,bio} = req.body;

    try{
        if(!email || !fullName || !password || !bio) {
        return res.json({sucess: false ,message : 'Missing Details'})
    }

    const user = await User.findOne({  email  })

    if(user) {
         return res.json({sucess: false ,message : 'User already exists'})
    }

    const hashedPassword = bcryptjs.hashSync(password,10)

    const newUser = await User.create({email,fullName, password: hashedPassword, bio})

    const token  = generateToken(newUser._id);

    res.json({success : true, userData: newUser, token, message:"Account created successfully"})

     
}catch(error){
    console.log(error.message)
    res.json({success : false,  message:"Not able to onboard you mate!"})

}

}

export const Login = (req,res)=>{
    const {email,password} =  req.body;
    
    try{
        const user = User.findOne({ email });
        if(!user){
        return res.json({success: false ,message: "Invalid User"})
    }

    const generatedPassword =  bcryptjs.compareSync(password, user.password)

     if(!generatedPassword){
        return res.json({success: false ,message: "Invalid User"})
    }

    const token  = generateToken(user._id);

    res.json({success : true, user , token, message:"Login successfully"})

    
    }catch(error){
        res.json({success : false,  message:"Login failed!"})

    }
}

// Controller to check user Authentication
export const checkAuth = ()=>{
    res.json({                                                                                          
        success: true,
        user : req.user
    })
}


// Update Profile Details

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){

         updatedUser = await User.findByIdAndUpdate(userId, {fullName,bio},{new:true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, fullName, bio},{new:true});
        }

        res.json({
            sucess:true,
            user: updatedUser
        })
        
    } catch (error) {
        res.json({
            sucess:false,
            message:'Updation failed'
        })
        
    }

}
