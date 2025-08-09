import { useContext, useEffect, useState } from "react"
import assets, { imagesDummyData } from "../assets/assets"
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthController"

export const RightSidebar = ()=>{
    
    const {selectedUser,messages} =  useContext(ChatContext)
    const {onlineUsers, logout}  =  useContext(AuthContext)

    const [msgImages, setMsgImages] =useState([])

    // extract the images from the chat window.
    useEffect(()=>{
       setMsgImages(messages.filter(msg=> msg.image).map(msg=>msg.image))

    },[messages])



    return selectedUser && <div className={`bg-[#8185B2]/40 relative text-white w-full overflow-y-scroll ${selectedUser ? 'max-md:hidden': ""}`}>
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className="rounded-full w-20 aspect-[1/1]" />
            <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
                { Array.isArray(onlineUsers) && onlineUsers?.includes(selectedUser._id) && <p className="w-2 h-2 bg-green-400 rounded-full"></p>} {selectedUser.fullName}</h1>
                <p className="text-white px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="mt-2 border-[#ffffff50] my-4"/>
        <div className="px-5 text-xs">
            <p>Media</p>
            <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                {msgImages.map((url,idx)=>(
                <div key={idx} onClick={()=>{window.open(url)}} className="rounded cursor-pointer">
                    <img src={url} alt="" className="h-full rounded-md"/>
                </div>
            ))}</div>
        </div>

        <button onClick={logout} className="absolute bg-slate-900 text-neutral-300 bottom-5 left-1/2  transform -translate-x-1/2 py-2 px-15  hover:bg-slate-950 rounded-md  font-light cursor-pointer hover:text-white transition duration-200 text-md">Logout</button>
    </div>
}