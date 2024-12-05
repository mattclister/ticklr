import { useState } from "react";
import { z } from "zod";
import { postReminderEmail } from "../Utilities/ServerRequests";

interface SettingsTabProps {
  handleLogOut: () => void;
  settopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

// Settings Component

const Settings = ({ handleLogOut, settopBarVisible }: SettingsTabProps) => {

  // States
  const [reminderEmail, setReminderEmail] = useState<string | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>('')

  const settingsSchema = z.object({
    email: z.string().min(3).max(32).email("Invalid email format")
  })

  const updateReminderEmail = (reminderEmail: string | undefined) => {
    const validation = settingsSchema.safeParse({ email: reminderEmail });

    if(validation) 
      {postReminderEmail(reminderEmail)}
    if (!validation.success) {
    setErrorMessage(validation.error.errors[0].message)
  }
}

  return (
    <>
      <h3>Settings</h3>
      <div className="container text-center">
        <label htmlFor="reminder-email" className="form-label">
          Reminder Email
        </label>

        <input
          id="reminder-email"
          type="text"
          className="form-control w-100"
          placeholder="Enter email"
          value={reminderEmail}
          onChange={(e) => setReminderEmail(e.target.value)}
        />

        <button type="button" className="btn btn-primary w-100 mt-3"
        onClick={()=> updateReminderEmail(reminderEmail)}
        >
          Update Email
        </button>

        <hr className="border border-3 opacity-75 w-100 mt-4" />

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

      
    </>
  );
};

export default Settings;
