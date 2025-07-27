import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

export const getUsersForSidebar = async(req,res)=>{

    try {
        const userId = req.body;
        const filteredUsers = await User.find({_id : {$ne: userId}}).select("-password");
         
        //Count all the unread messages
        const unseenMesssages = {};
        const promises  = filteredUsers.map(async(user)=>{
            const message = await Message.find({senderId: user._id, recieverId: userId, seen: false})

            if(message.length>0){
                unseenMesssages[user._id] = message.length;
    
            }
        })

        await Promise.all(promises);

        res.json({
            success :true,
            users: filteredUsers,
            unseenMesssages
        })
        
    } catch (error) {
        res.json({
            success:false,
            message: "FilteredUser Error"
        })
        
    }
}

// message for selected User

export const getMessages = async(req,res)=>{
    try {
        const {id : selectedUserId} = req.params;
        const myId = res.user._id;

        const message = await Message.find({
            $or: [
                {senderId: myId, recieverId: selectedUserId},
                {senderId: selectedUserId, recieverId: myId}
                
            ]
        })

        await Message.updateMany({senderId: myId, recieverId: selectedUser}, {seen: true})

        res.json({
            success:true,
            message
        })
        
    } catch (error) {
        res.json({
            success:false,
            message: 'Failed to load Selected Message'
        })
        
    }

}

// mark message as seen using id

export const markedMessageAsSeen = async(req,res)=>{
    try {
        const{ id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({
            success: true
        })
        
    } catch (error) {
        res.json({
            success: false ,
            message : 'failed while marking messsage as seeen using id'
        })
        
    }
}

// Send message to user
export const sendMessage = async(req,res)=>{
    const {text, image}  = req.body;
    try {
        const {id :recieverId }= req.prams;
        const senderId = req.user._id; 
        
        let imageUrl;

        if(image){
           const uploadResponse =  await cloudinary.uploader.upload(image)
           imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            recieverId,
            text,
            image:imageUrl
        })

        // Emit the new message to the reciever's socket
        const recieverSocketId = userSocketMap[recieverId]  
        
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage)
        }
       
        res.json({
            success:true,
            newMessage
        })
        
    } catch (error) {
        res.json({
            success:false,
            message: error.message
        })
    }

}

