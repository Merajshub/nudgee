import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Profile } from "./pages/Profile"
import toast, { Toaster } from 'react-hot-toast'
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthController"


function App() {
  const { authUser } = useContext(AuthContext)
  
  return <div className="absolute h-screen w-screen [background:radial-gradient(100%_125%_at_50%_120%,#000_40%,#63e_90%,#f0f_100%)] text-neutral-200">
      <Toaster/>
      <Routes>
       <Route path="/" element= {authUser ? <Home/>: <Navigate to='/login'/>}/>
       <Route path="/login" element= {!authUser?<Login/>: <Navigate to='/'/>}/>
       <Route path="/profile" element= {authUser? <Profile/>: <Navigate to='/login'/>}/>
      </Routes>
    
    </div>
  
  
}

export default App
