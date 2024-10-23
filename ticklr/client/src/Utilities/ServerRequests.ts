import { FormData } from "../Components/UserRegisterForm";
import { LoginData } from "../Components/UserLoginForm";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

// Create User

export const CreateUser = async (data: FormData) => {
  const formDataPacket = {
    ...data,
    confirmPassword: undefined,
  };

  console.log(formDataPacket);

  apiClient
    .post("/users", formDataPacket)
    .then((response) => {
      console.log("Data submitted successfully", response.data);
    })
    .catch((error) => {
      console.error("Error submitting data", error);
    });
};

// Login User

export const LoginUser = async (data: LoginData) => {

  apiClient
    .post("/login", data)
    .then((response) => {
      console.log("User Logged In", response);
      localStorage.setItem("webToken",response.data.token)
    })
    .catch((error) => {
      console.log("Failed to Login", error);
    });
};

// Authenticate User

export const AuthenticateUser = (token: string | null) => {
  if (!token) {
    console.error("Token not provided");
    return;
  }

  return apiClient.post("/authenticate", { token })
    .then((response) => {
      console.log("User Authenticated", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Failed to authenticate", error.response ? error.response.data : error.message);
      return error;
    });
};