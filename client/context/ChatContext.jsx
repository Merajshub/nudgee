import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthController";
import toast from "react-hot-toast";

export const ChatContext  = createContext();

export const ChatProvider = ({children})=>{
const [messages,setMessages] = useState([])
const [users, setUsers]  = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [unseenMessages, setUnseenMessages] = useState({})

const {socket , axios} = useContext(AuthContext);

// get all the users for left sidebar 
const getUsers = async()=>{
        
    try {
        const {data}  = await axios.get('/api/messages/users')
        if(data.success){           
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
        }

    } catch (error) {
       toast.error(
      error?.response?.data?.message || error?.message || "Failed to fetch users"
    );
    }
}

// get messages for selectedUser 

const getMessages = async(userId)=>{
    try {
        const {data} = await axios.get(`/api/messages/${userId}`)

        if(data.success){
            setMessages(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        
    }


}

// send message to selected user
const sendMessage = async(messageData)=>{
    try {
        const {data } = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
        if(data.success){
            setMessages((prevMessages)=> [...prevMessages, data.newMessage])
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        
    }
}

//get the messages in the convo in realtime

const subscribeToMessages = async()=>{
    if(!socket) return;
    // recieving messages.
    socket.on('newMessages', (newMessage)=>{
        if(selectedUser && newMessage.senderId === selectedUser._id){
            newMessage.seen = true;
            setMessages((prevMessages)=>[...prevMessages,newMessage]);
            axios.put(`/api/messages/mark/${newMessage._id}`);

        }else{
            setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages,
                [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1 
            }))
        }
    })
}

// Unsubscribe from messages // left the room
 const unsubscribeFromMessages = ()=>{
    if(socket) socket.off('newMessage')
 } 

useEffect(()=>{   
     subscribeToMessages()

    return (()=>{
        unsubscribeFromMessages()
    })
},[socket,selectedUser])



    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        setMessages,
        sendMessage,
       setSelectedUser,
       setUnseenMessages

    }


    return  <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}