import { useEffect, useState } from "react";
import { z } from "zod";
import { updateSettings, getSettings } from "../Utilities/ServerRequests";

interface SettingsTabProps {
  handleLogOut: () => void;
  settopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const settingsSchema = z.object({
  email: z.string().min(3).max(32).email("Invalid email format"),
});

export type settingsType = z.infer<typeof settingsSchema>;


// Settings Component

const Settings = ({ handleLogOut, settopBarVisible }: SettingsTabProps) => {
  // States
  const [settingsValues, setSettings] = useState<settingsType | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [emailState,setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const updateReminderEmail = (email: string | undefined) => {
    const validation = settingsSchema.safeParse({ email: email });

    if (validation) {
      updateSettings(email);
      console.log(email)
      settopBarVisible(false)
    }
    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
    }
  };

  // Get Settings Information

    useEffect(() => {
      const fetchSettings = async () => {
        try {
          console.log(`Fetching Settings...`);
          const settings = await getSettings();
          setSettings(settings);
          setLoading(false);
          setEmail(settings?.email)
        } catch (error) {
          console.error("Error fetching settings:", error);
          setLoading(false);
        }
      };
      fetchSettings();
  
    }, []);

    return (
      loading ? <p>Loading Settings</p> : (
        <>
          <h3>Settings</h3>
          <div className="container text-center">
            <label className="mt-1 mb-2" htmlFor="reminder-email">Reminder email</label>
            <div id="email-reminder-settings-group" className="email-reminder-group">
              <input
                id="reminder-email"
                type="text"
                className="form-control w-100 email-reminder-input"
                value={emailState}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {settingsValues?.email === emailState?
              <button onClick={() => updateReminderEmail(emailState)} className="btn btn-success email-reminder-btn" disabled>
                Verified
              </button>:
              <button onClick={() => updateReminderEmail(emailState)} className="btn btn-warning email-reminder-btn">
                Verify
              </button>}
            </div>
    
            <hr className="border border-3 opacity-75 w-100 mt-4" />
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className="btn btn-outline-warning w-100 mt-3"
                onClick={() => settopBarVisible(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-danger w-100 mt-3"
                onClick={() => handleLogOut()}
              >
                Log Out
              </button>
            </div>
          </div>
        </>
      )
    );
  }
    

export default Settings;
