import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Profile } from "./pages/Profile"
import toast, { Toaster } from 'react-hot-toast'
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthController"


function App() {
  const { authUser } = useContext(AuthContext)

//   useEffect(() => {
//   toast.success("Test toast!");
// }, []);
  
  return <div className="h-screen bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-gray-800">
      <Toaster/>
      <Routes>
       <Route path="/" element= {authUser ? <Home/>: <Navigate to='/login'/>}/>
       <Route path="/login" element= {!authUser?<Login/>: <Navigate to='/'/>}/>
       <Route path="/profile" element= {authUser? <Profile/>: <Navigate to='/login'/>}/>
      </Routes>
    
    </div>
  
  
}

export default App
