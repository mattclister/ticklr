import { useEffect, useState } from "react";
import { z } from "zod";
import { updateSettings, getSettings } from "../Utilities/ServerRequests";
import { use } from "framer-motion/client";

interface SettingsTabProps {
  handleLogOut: () => void;
  settopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

// Settings Component

const Settings = ({ handleLogOut, settopBarVisible }: SettingsTabProps) => {
  // States
  const [settingsValues, setSettings] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [emailState,setEmail] = useState<string | undefined>();

  const settingsSchema = z.object({
    email: z.string().min(3).max(32).email("Invalid email format"),
  });

  const updateReminderEmail = (email: string | undefined) => {
    const validation = settingsSchema.safeParse({ email: email });

    if (validation) {
      updateSettings(email);
      console.log(email)
    }
    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
    }
  };

  return (
    <>
      <h3>Settings</h3>

<div className="container text-center">
  <div id="email-reminder-settings-group" className="email-reminder-group">
        <input
          id="reminder-email"
          type="text"
          className="form-control w-100 email-reminder-input"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={()=>updateReminderEmail(emailState)} className="btn btn-warning email-reminder-btn">Verify</button>
        </div>

        <hr className="border border-3 opacity-75 w-100 mt-4" />
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-warning w-100 mt-3"
            onClick={() => settopBarVisible(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger w-100 mt-3"
            onClick={() => handleLogOut()}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;
