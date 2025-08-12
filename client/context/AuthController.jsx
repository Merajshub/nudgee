import {createContext, useEffect } from "react";
import axios from 'axios'
import { useState } from "react";
import {io} from 'socket.io-client'
import toast from "react-hot-toast";



export const AuthContext = createContext();


const backendUrl = import.meta.env.VITE_BACKEND_URL

axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({children})=>{

    const [token , setToken] = useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket , setSocket] = useState(null)
    const [loading,setLoading] = useState(false)

    

    const checkAuth = async()=>{
        try {

            const {data} = await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }

        } catch (error) {
           toast.error(error.message)
            
    }
}
 // for login or signUp
    const login = async(state, credentials)=>{
        try {
            setLoading(true)
            const {data}  = await axios.post(`/api/auth/${state}`,credentials)
            
            if(data.success){
                setLoading(false)
                
                setAuthUser(data.userData);
                
                connectSocket(data.userData)
               
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token) 
                localStorage.setItem('token', data.token)
                toast.success(data.message);               
            }else{
                toast.error(data.message)
                setLoading(true)
            }
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
        }

    }

  
    

    const logout = async()=>{
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common['token'] = null;
        toast.success("Logout Successfuly")
        socket.disconnect();
    }

    const updateProfile = async(body)=> { 
        
        try {
            setLoading(true)
            const { data } = await axios.put('/api/auth/update-profile', body)

            if(data.success){
                setLoading(false)
                toast.success('from data success')
                setAuthUser(data.user)                          
                toast.success('Profile Updated Successfully')
        }
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
            
        }

        }

    

    // Socket function to handle socket connection and online users updates
    const connectSocket  = (userData)=>{
        if(!userData && socket?.connected) return;
        // create socket connection
        const newSocket = io(backendUrl,{
            query: {
                userId : userData._id
            }
        })
    // you actually don't need that 
    //  newSocket.connect()

     setSocket(newSocket)

     newSocket.on('getOnlineUser',(userIds)=>{
        setOnlineUsers(userIds)

     })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['token'] = token;
        }

        checkAuth()
    },[])
    

    const value = {
        token,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        axios,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


 