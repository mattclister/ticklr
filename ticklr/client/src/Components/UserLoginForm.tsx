import { useState } from "react";
import { LoginUser } from "../Utilities/ServerRequests";

export type LoginData = {
  user_email: string;
  user_Password: string;
};

export interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserLoginForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleLogin = () => {
    const loginData: LoginData = {
      user_email: userEmail,
      user_Password: userPassword,
    };
    console.log(Object(loginData).values)
    LoginUser(loginData)
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
