import { useState, useRef } from "react";
import logo from "../assets/ticklrLogo.png";
import { UserLoginForm } from "./UserLoginForm";
import { UserRegisterForm } from "./UserRegisterForm";
import Joyride, { StoreHelpers, Step} from 'react-joyride';


interface LoginProps {
  handleSetLogIn: () => void;
}

export const LoginPage = ({ handleSetLogIn }: LoginProps) => {

  const [showSignUp, setshowSignUp] = useState(false);
  const joyrideHelpers = useRef<StoreHelpers | null>(null)
  const handleTourEnd = (data: any) => {
    if (data.status === "ready" ){joyrideHelpers.current?.reset(true)}
  }

  const steps: Step[] = [
    {
      target: '#userEmail',
      content: "Welcome! Feel free to sign up, or click 'Next' to use the Demo login details",
      disableBeacon: false,
      placement: 'right'
    },
    {
      target: '#userEmail',
      content: 'Demo email: demo@email.com',
      disableBeacon: false,
      placement: 'right'
    },
    {
      target: '#userPassword',
      content: 'Demo password: abc123!!',
      disableBeacon: false,
      placement: 'right'
    }
  ];

  return (
    <div id="loginPage">
      <Joyride
            steps={steps}
            continuous={true}
            disableOverlay={true}
            run={true}
            showProgress={true}
            showSkipButton={true}
            getHelpers={(helpers) => (joyrideHelpers.current = helpers)}
            callback={(data)=>handleTourEnd(data)}
          />
      <img src={logo} id="logo-md" alt="Logo" />
      {showSignUp ? (
        <UserRegisterForm setshowSignUp={setshowSignUp} />
      ) : (
        <UserLoginForm handleSetLogIn={handleSetLogIn} />
      )}
      <button
        id="sign-login-toggle"
        type="button"
        className="btn btn-outline-primary w-100 login-btn"
        onClick={() => setshowSignUp(!showSignUp)}
      >
        {showSignUp ? "Login" : "Sign Up"}
      </button>
      <div className="mt-3">
        <a href="/docs">What is Ticklr?</a>
      </div>
    </div>
  );
};