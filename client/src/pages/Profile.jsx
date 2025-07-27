import { useState } from "react"
import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"

export const Profile = ()=>{
const[selectedImage,setSelectedImage] = useState(null)
const[name,setName] = useState('John Doe')
const[bio,setBio] = useState('hello user')
const navigate = useNavigate()

const handleSubmit = (e)=>{
    e.preventDefault();
    navigate('/')
    
}


    return <div className="min-h-screen flex items-center justify-center">
        <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                <h3 className="text-lg">Profile Details</h3>
                <label htmlFor="avatar" className="flex items-center gap-2">
                    <input onChange={(e)=>{setSelectedImage(e.target.files[0])}} type="file" id='avatar' accept=".png, .jpg, .jpeg" hidden/>
                    <img src={selectedImage ? URL.createObjectURL(selectedImage):assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}  />
                    Upload Profile Image
                </label>
                <input type="text" placeholder="Name" required className="border p-2 border-gray-500 rounded-md focus:outline-none" value={name} onChange={(e)=>{setName(e.target.value)} }/>
                <textarea onChange={(e)=>{setBio(e.target.value)} } value={bio} className="p-2 border border-gray-500 rounded-md focus:outline-none" required rows={4}>{bio}</textarea>
                <button type="submit" className="text-lg py-2 px-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 rounded-md cursor-pointer">Save</button>
            </form>
        </div>
    
    </div>
}