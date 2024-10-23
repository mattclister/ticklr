import { LoginPage } from './Components/LoginPage'
import './App.css'
import { useState } from 'react'
import { RemindersPage } from './Components/RemindersPage'
// import { AuthenticateUser } from './Utilities/ServerRequests'

function App() {

  const [loggedIn,setLoggedIn] = useState(false)
  // const JWT_Token = localStorage.getItem("webToken")
  // AuthenticateUser(JWT_Token)

  return (
    <>
     {loggedIn?<RemindersPage/>:<LoginPage/>}
     <button onClick = {()=>setLoggedIn(!loggedIn)}>Log In</button>
    </>
  )
}

export default App
