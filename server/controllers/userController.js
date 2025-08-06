import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcryptjs from 'bcryptjs'

export const signup = async(req,res)=>{
    const {fullName,email,password,bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio) {
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

export const Login = async (req,res)=>{
    const {email,password} =  req.body;
    
    try{
        const userData =await User.findOne({ email });
        // console.log(userData);
        
        if(!userData){
        return res.json({success: false ,message: "Invalid User"})
    }

    const generatedPassword =  bcryptjs.compareSync(password, userData.password)

     if(!generatedPassword){
        return res.json({success: false ,message: "Invalid User"})
    }

    const token  = generateToken(userData._id);

    res.json({success : true, userData , token, message:"Login successfully"})

    
    }catch(error){
        res.json({success : false,  message:"Login failed!"})

    }
}

// Controller to check user Authentication
export const checkAuth = (req,res)=>{
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
            updatedUser =await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, fullName, bio},{new:true});
        }

        res.json({
            success:true,
            user: updatedUser
        })
        
    } catch (error) {
        res.json({
            sucess:false,
            message:'Updation failed'
        })
        
    }

}
