import { useContext, useState } from "react"
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthController"

export const Login = ()=>{
    const[currState,setCurrState] = useState('Signup')
    const [fullName,setFullName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [bio,setBio] = useState('')
    const [isDataSubmitted,setIsDataSubmitted] = useState(false)


    const { login } = useContext(AuthContext)


    const handleSubmit = (e)=>{
        console.log('hello')
        console.log(isDataSubmitted);
        
        e.preventDefault()
        if(currState === 'Signup' && !isDataSubmitted){
            setIsDataSubmitted(true)
            return;
        }

        login(currState === 'Signup' ? 'signup': 'login', { fullName,email,password,bio })
    }
    console.log(isDataSubmitted)
    return <div className="min-h-screen  flex max-sm: flex-col items-center justify-center gap-8 text-white">


        <form onSubmit = {handleSubmit} className="w-96 border-2 bg-white/8 border-gray-500 p-6 flex flex-col gap-6 rounded-md shadow-lg">
        <h2 className="flex justify-between text-2xl items-center">{currState}
            {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" /> }
            
        </h2>
         {currState==='Signup' && !isDataSubmitted && <input onChange={(e)=>{setFullName(e.target.value)}} value = {fullName} type="text" placeholder="FullName" className="border p-2 border-gray-500 rounded-md focus:outline-none" required/>}
         { !isDataSubmitted &&
          <>
        <input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email" value={email}  required className="border p-2 border-gray-500 rounded-md focus:outline-none"/>
        <input onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" value={password} required className="border p-2 border-gray-500 rounded-md focus:outline-none" />
          </>
         }

         {currState==='Signup' && isDataSubmitted && (
            <textarea onChange={(e)=>{setBio(e.target.value)}} rows={4} className="p-2 border border-gray-600 rounded-md" value={bio} placeholder="Bio..." required></textarea>
         )}
        <button type="submit" className="py-2 px-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 rounded-md text-sm font-light cursor-pointer">{currState === 'Signup'? 'SIGNUP': 'LOGIN'}</button>
        <div className="flex gap-2">
        <input type="checkbox"/>
        <p className="text-sm text-gray-400">Agree to the terms of use & privacy policy</p>
        </div>
        {currState!=='Signup'? <p className="text-gray-400 font-medium">Don't have an account? <span onClick={()=>{setCurrState('Signup')}} className="text-gray-800 hover:underline cursor-pointer">Singup</span></p>: <p className="text-gray-400 font-medium">Already have an account? <span onClick={()=>{setCurrState('Login'); setIsDataSubmitted(false)}} className="text-gray-800 hover:underline cursor-pointer">Login here</span></p> }
        </form>
        
       
    </div>
}