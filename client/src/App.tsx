import { LoginPage } from "./Components/LoginPage";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { RemindersPage } from "./Components/RemindersPage";
import { AuthenticateUser } from "./Utilities/ServerRequests";
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer } from 'react-toastify';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const JWT_Token = localStorage.getItem("webToken");

  // Authenticate User and Auto Login
  
  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem("webToken");
      if (token) {
        try {
          const data = await AuthenticateUser(token);
          setLoggedIn(data.message === "Token is valid");
        } catch (error) {
          console.error("Authentication failed", error);
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
      setIsLoading(false);
    };
  
    authenticate();
  }, []);
  

  // Functions
    function handleLogOut() {
      setLoggedIn(false);
      localStorage.removeItem("webToken")
    }  

    function handleSetLogIn() {
      setLoggedIn(true);
    }  

  // Show loading spinner while user being authenticated

  if (isLoading) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>
    );
  } else {
    // If user authenticated, auto login else show login page

    return <>
    <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} transition={Slide}/>
    {loggedIn ? <RemindersPage handleLogOut={handleLogOut}/> : <LoginPage handleSetLogIn={handleSetLogIn}/>}</>;
  }
}

export default App;