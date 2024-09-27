import logo from "../assets/ticklrLogo.png"
import { UserLoginForm } from "./UserLoginForm"

export const LoginPage = () => {
  return (
    <>
    <img src={logo} id="logo-md" alt="Logo"/>
    <UserLoginForm/>
    </>
  )
}
