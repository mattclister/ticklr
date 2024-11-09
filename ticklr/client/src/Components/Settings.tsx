
interface SettingsTabProps {
  handleLogOut: () => void;
}

const Settings = ({handleLogOut}: SettingsTabProps) => {
  return (
    <>
    <div>Settings</div>
    <input type="text"></input>
    <p> This is my panel</p>
    <button type="button" className="btn btn-danger" onClick={()=>handleLogOut()}>Log Out</button>
    </>
  )
}

export default Settings