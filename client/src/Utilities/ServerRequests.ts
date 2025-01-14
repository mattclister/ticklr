import { FormData } from "../Components/UserRegisterForm";
import { LoginData } from "../Components/UserLoginForm";
import axios from "axios";
import {settingsType} from "../Components/Settings";
import { ReminderType } from "./types";

const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
});

// Create User

export const CreateUser = async (data: FormData, setshowSignUp: React.Dispatch<React.SetStateAction<boolean>>) => {
  const formDataPacket = {
    ...data,
    confirmPassword: undefined,
  };

  apiClient
    .post("/users", formDataPacket)
    .then((response) => {
      console.log("User created", response.data);
      setshowSignUp(false)
    })
    .catch((error) => {
      console.error("Failed to create user", error);
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

// Add Reminder

export const addReminder = async (newReminder: ReminderType) => {
  let token = localStorage.getItem("webToken");

  try {
    const response = await apiClient.post(
      "/reminders",
      newReminder,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Reminder Added", response.data);
    return response.data; // Return the server's response
  } catch (error) {
    console.error("Error adding reminder", error);
    throw error; // Rethrow the error if you need to handle it at a higher level
  }
};


// Delete Reminder

export const deleteReminder = async (activeID: number | undefined) => {
  let token = localStorage.getItem("webToken");

  apiClient
  .delete(`/reminders/${activeID}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((response) => {
    console.log("Reminder Deleted", response.data);
  }).catch ((error) => {
    console.error("Error deleting reminder", error);
  });
}

// Update Settings

export const updateSettings = async (reminderEmail: string | undefined) => {
  let token = localStorage.getItem("webToken");
  console.log("Validating Email")
  console.log(reminderEmail)

  apiClient.post(
    "/validate",{email: reminderEmail},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((response) => {
      console.log("Settings updated", response.data);
    })
    .catch((error) => {
      console.error("Error updating settings", error);
    });
};

// Get Settings

export const getSettings = async (): Promise<settingsType | undefined> => {
  let token = localStorage.getItem("webToken");

  try {
    const response = await apiClient.get("/settings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Settings received", response.data);
    return response.data.settings as settingsType; 
  } catch (error) {
    console.error("Error getting settings", error);
    return undefined;
  }
};


