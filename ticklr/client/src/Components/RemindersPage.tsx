import { useState } from "react"
import { RemindersList } from "./RemindersList"
import logo from "../assets/ticklrLogo.png"

export const RemindersPage = () => {
  
  const [settingsVisable, setSettingsVisble] = useState(false)

    return (
    <div id="reminders-page-container">
    <div id="reminders-list-header">
      <img src={logo} id="logo-md" alt="Logo" className="img-fluid"/>

    </div>
    <RemindersList/>
    <div id="reminders-list-footer"></div>
    </div>
  )
}
