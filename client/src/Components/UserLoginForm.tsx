import { useState } from "react";
import { LoginUser } from "../Utilities/ServerRequests";
import { notify } from "../Utilities/notifications";

export type LoginData = {
  user_email: string;
  user_Password: string;
};

export interface LoginProps {
  handleSetLogIn: () => void
  }

export const UserLoginForm = ({handleSetLogIn}:LoginProps ) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [failedToLogin, setFailedToLogin] = useState(0)

  const handleLogin = async () => {
    const loginData: LoginData = {
      user_email: userEmail,
      user_Password: userPassword,
    };

    try {
      const result = await LoginUser(loginData);
 
      if (result) {
        handleSetLogIn();
        notify(`User Logged in`,"success")
      } else {
        setFailedToLogin(failedToLogin+1)
        notify(`Login details not recognised`,"warn")
      }

    } catch (error) {
      console.log("Login Failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label className="form-label">Email</label>
      <input
        id="userEmail"
        className="form-control"
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      ></input>
      <label className="form-label">Password</label>
      <input
        id="userPassword"
        className="form-control"
        type="password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
      ></input>
      <button
        type="button"
        className="btn btn-primary w-100 login-btn"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};
