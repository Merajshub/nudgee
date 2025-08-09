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

useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (newMessage) => {
    const currentSelectedUser = selectedUser;

    // If message is from currently selected user in chat
    if (currentSelectedUser && newMessage.senderId === currentSelectedUser._id) {
      newMessage.seen = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      axios.put(`/api/messages/mark/${newMessage._id}`);
    } else {
      // Safely update unseen messages even if undefined
      const senderId = newMessage.senderId;
      setUnseenMessages((prev) => {
        const current = prev[senderId] || 0;
        return {
          ...prev,
          [senderId]: current + 1,
        };
      });
    }
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket, selectedUser]);



    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
       setSelectedUser,
       setUnseenMessages

    }


    return  <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}