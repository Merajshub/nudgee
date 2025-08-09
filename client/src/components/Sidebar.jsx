import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"
import {useContext, useEffect, useState} from 'react'
import { AuthContext }from "../../context/AuthController"
import { ChatContext } from "../../context/ChatContext"


export const Sidebar = ()=>{
    const{getUsers, users,selectedUser,unseenMessages ,setSelectedUser, setUnseenMessages} = useContext(ChatContext)
   const {logout,onlineUsers} = useContext(AuthContext)
   const [input, setInput] =  useState(false)
    const navigate = useNavigate();  
   
    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())):users;
    

    const handleUserClick = (user) => {
    setSelectedUser(user);

    setUnseenMessages((prev) => {
    const updated = { ...prev };
    updated[user._id] = 0;
    return updated;
  });
};
    
    useEffect(()=>{
        getUsers()
    },[onlineUsers])

    return <div className={`bg-[#8185B2]/10 max-h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden': ''}`}>
        <div className="pb-5">
       <div className=" flex  justify-between items-center">
        <img src={assets.logo} alt="logo" className="max-w-40" />
        <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="Menu" className="max-h-5  cursor-pointer"/>
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-neutral-400 text-gray-100 hidden group-hover:block">
                <p onClick={()=>{navigate('/profile')}} className="cursor-pointer text-sm">Edit Profile</p>
                <hr className="my-2 border-t border-gray-500" />
                <p onClick={()=>{logout()}} className="cursor-pointer text-sm">Logout</p>
            </div>
        </div>
       </div>
        <div className="bg-[#282142] rounded-md flex item-center gap-2 py-3 px-4 mt-2">
            <img src={assets.search_icon} alt="Search" className="w-4" />
            <input onChange={(e)=>{setInput(e.target.value)}} type="text" className="bg-transparent border-none outline-none text-white text-xs placeholder:[#c8c8c8] flex-1" placeholder="Search User..."/>
        </div>
        </div>
        <div>
        {filteredUsers.map((user,idx)=>(
            <div onClick={()=>{
                setSelectedUser(user)
                handleUserClick(user)
            }} 
            className={` relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}  key={idx}>
                <img src={user?.profilePic || assets.avatar_icon} alt="Profilepic" className="w-[35px] aspect-[1/1] rounded-full" />
                <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>               
                {
                    
                    Array.isArray(onlineUsers) && onlineUsers.includes(user._id) ? <span className="text-sm text-green-400">Online</span> :
                    <span className="text-sm text-neutral-400">Offline</span>
                }
                </div>
                {unseenMessages?.[user._id] > 0 && (
            <p className="absolute right-4 bg-violet-500/50 rounded-full h-5 w-5 flex items-center justify-center">
              {unseenMessages[user._id]}
            </p>
             )}
            </div>
        ))}
        </div>

        
    </div>
}