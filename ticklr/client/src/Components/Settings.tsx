
interface SettingsTabProps {
  handleLogOut: () => void;
  settopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Settings = ({ handleLogOut, settopBarVisible }: SettingsTabProps) => {
  return (
    <>
      <div id="settings-container">
        <h3>Settings</h3>
        <div
          id="reminder-email-update-container"
        >
          <label htmlFor="reminder-email" className="w-75">
            Reminder Email
          </label>
          
          <input
            id="reminder-email"
            type="text"
            className="form-control w-75"
            placeholder="Enter email"
          />
          
          <button type="button" className="btn btn-primary w-75">
            Update
          </button>
        </div>

        <br></br>
        
        <button
          type="button"
          className="btn btn-warning w-75 mt-3"
          onClick={() => settopBarVisible(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger w-75 mt-3"
          onClick={() => handleLogOut()}
        >
          Log Out
        </button>
      </div>
    </>
  );
};


export default Settings