import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthController"
import Loader from "../components/Loader"

export const Profile = ()=>{
    const {authUser,updateProfile,loading} = useContext(AuthContext) 
    const[selectedImage,setSelectedImage] = useState(null)   
    const navigate = useNavigate()
    const [name, setName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio);

const handleSubmit = async(e)=>{
    
    e.preventDefault();
    if(!selectedImage){      
        await updateProfile({fullName: name,bio})       
        navigate('/')
       return;
    }
    
    
    //converting the image to base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage)
    reader.onload = async()=>{
        const base64Image = reader.result;
        await updateProfile({profilePic: base64Image,fullName: name,bio})
        navigate('/')
    }
    
}
    return <div className="min-h-screen flex items-center justify-center">
        <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                <h3 className="text-lg">Profile Details</h3>
                <label htmlFor="avatar" className="flex items-center gap-2">
                    <input onChange={(e)=>{setSelectedImage(e.target.files[0])}} type="file" id='avatar' accept=".png, .jpg, .jpeg" hidden/>
                    <img src={selectedImage ? URL.createObjectURL(selectedImage):authUser?.profilePic || assets.avatar_icon} alt="" className='w-12 h-12 rounded-full'  />
                    Upload Profile Image 
                </label>
                <input type="text" placeholder="Name" required className="border p-2 border-gray-500 rounded-md focus:outline-none" value={name} onChange={(e)=>{setName(e.target.value)} }/>
                <textarea onChange={(e)=>{setBio(e.target.value)} } value={bio} className="p-2 border border-gray-500 rounded-md focus:outline-none" required rows={4}>{bio}</textarea>
                <button type="submit" className="text-lg text-neutral-300 py-2 px-20 bg-indigo-800 hover:bg-indigo-700 hover:text-white transition  duration-300 rounded-md cursor-pointer flex items-center justify-center">{loading ? <Loader loading={loading}/> : 'Save'}</button>
            </form>
        </div>
    
    </div>
}