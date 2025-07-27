import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        require: true,
        unique: true
    },
    fullName:{
        type:String,
        require:true,
        minLenght:6
    },
    password: {
        type : String,
        minLength:6,
        require: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type:String
    }
},{timestamps:true})

const User = mongoose.model('User',UserSchema)

export default User