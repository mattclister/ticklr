import { LoginPage } from './Components/LoginPage'
import './App.css'
import { useState } from 'react'
import { RemindersPage } from './Components/RemindersPage'

function App() {

  const [loggedIn,setLoggedIn] = useState(false)

  return (
    <>
     {loggedIn?<RemindersPage/>:<LoginPage setLoggedIn = {setLoggedIn}></LoginPage>}
    </>
  )
}

export default App
