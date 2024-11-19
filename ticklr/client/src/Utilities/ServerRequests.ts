import { FormData } from "../Components/UserRegisterForm";
import { LoginData } from "../Components/UserLoginForm";
import axios from "axios";
import { NewReminderType } from "../Components/ItemDetails";

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
  try {
    const response = await apiClient.post("/login", data);
    console.log("User Logged In", response);
    localStorage.setItem("webToken", response.data.token);
    
    return true
  } catch (error) {
    console.log("Failed to Login", error);
    return false
  }
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

// Get Reminders

export const getReminders = async () => {
  let token = localStorage.getItem("webToken");
  try {
    const response = await apiClient.get(`/reminders`, {
      headers: { 
      Authorization: `Bearer ${token}`
    }
    });
    return response.data.reminders;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error  
}
};

export const addReminder = (reminder: NewReminderType) => {

  console.log(reminder)

  apiClient
    .post("/reminders", )
    .then((response) => {
      console.log("Reminder Added", response.data);
    })
    .catch((error) => {
      console.error("Error adding reminder", error);
    });
};