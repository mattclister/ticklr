import { LoginPage } from "./Components/LoginPage";
import "./App.css";
import { useState, useEffect } from "react";
import { RemindersPage } from "./Components/RemindersPage";
import { AuthenticateUser } from "./Utilities/ServerRequests";


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const JWT_Token = localStorage.getItem("webToken");

  // Authenticate User and Auto Login
  
  useEffect(() => {
    const JWT_Token = localStorage.getItem("webToken");

    // Authenticate User and Auto Login
    if (JWT_Token) {
      AuthenticateUser(JWT_Token)?.then((data) => {
        if (data.message === "Token is valid") {
          setLoggedIn(true);
          setUserID(data.userId);

        } else {
          setLoggedIn(false);
          setUserID(undefined);
        }
        setIsLoading(false);
      });
    } else {
      setLoggedIn(false);
      setUserID(undefined);
      setIsLoading(false);
    }
  }, []);

  // Functions
    function handleLogOut() {
      setLoggedIn(false);
      setUserID(undefined);
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

    return <>{loggedIn ? <RemindersPage userID={userID} handleLogOut={handleLogOut}/> : <LoginPage handleSetLogIn={handleSetLogIn}/>}</>;
  }
}

export default App;