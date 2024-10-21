import { useState } from "react"
import logo from "../assets/ticklrLogo.png"
import { UserLoginForm } from "./UserLoginForm"
import { UserRegisterForm } from "./UserRegisterForm"

// State to toggle if user is logged in.
interface Props {
  setLoggedIn: (boolean: boolean) => void
}

export const LoginPage = ({setLoggedIn}: Props) => {

  // State User to toggle sign up option.

  const [showSignUp,setshowSignUp] = useState(false)
  return (
    <div id="loginPage">
    <img src={logo} id="logo-md" alt="Logo"/>
    {showSignUp?<UserRegisterForm/>:<UserLoginForm setLoggedIn={setLoggedIn}/>}
    <button  id="sign-login-toggle" type="button" className="btn btn-outline-primary w-100 login-btn" onClick={()=>setshowSignUp(!showSignUp)}>{showSignUp?"Login":"Sign Up"}</button>
    </div>
  )
}