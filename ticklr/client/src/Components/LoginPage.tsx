import { useState } from "react"
import logo from "../assets/ticklrLogo.png"
import { UserLoginForm } from "./UserLoginForm"
import { UserRegisterForm } from "./UserRegisterForm"

export const LoginPage = () => {
  // State User to toggle sign up option.
  const [signUp,setSignUp] = useState(false)
  return (
    <div id="loginPage">
    <img src={logo} id="logo-md" alt="Logo"/>
    {signUp?<UserRegisterForm/>:<UserLoginForm/>}
    <button  type="button" className="btn btn-outline-primary w-100" onClick={()=>setSignUp(!signUp)}>{signUp?"Log In":"Sign Up"}</button>
    </div>
  )
}
