import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Profile } from "./pages/Profile"

function App() {
  

  return (
    <>
    <div className="h-screen bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-gray-800">
      <Routes>
       <Route path="/" element= {<Home/>}/>
       <Route path="/login" element= {<Login/>}/>
       <Route path="/profile" element= {<Profile/>}/>
      </Routes>
    
    </div>
    </>
  )
}

export default App
