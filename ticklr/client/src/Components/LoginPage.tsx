import { useState } from "react"
import logo from "../assets/ticklrLogo.png"
import { UserLoginForm } from "./UserLoginForm"
import { UserRegisterForm } from "./UserRegisterForm"

interface LoginProps {
  handleSetLogIn: () => void
}

export const LoginPage = ({handleSetLogIn}: LoginProps) => {

  // State User to toggle sign up option.

  const [showSignUp,setshowSignUp] = useState(false)
  return (
    <div id="loginPage">
    <img src={logo} id="logo-md" alt="Logo"/>
    {showSignUp?<UserRegisterForm/>:<UserLoginForm handleSetLogIn={handleSetLogIn}/>}
    <button  id="sign-login-toggle" type="button" className="btn btn-outline-primary w-100 login-btn" onClick={()=>setshowSignUp(!showSignUp)}>{showSignUp?"Login":"Sign Up"}</button>
    </div>
  )

}