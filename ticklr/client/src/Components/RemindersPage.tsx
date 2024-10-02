import { useState } from "react"
import { RemindersList } from "./RemindersList"
import logo from "../assets/ticklrLogo.png"
import sidebar from "../assets/list.svg"

export const RemindersPage = () => {
  
  const [settingsVisable, setSettingsVisble] = useState(false)
  const [sideBarVisable, setSideBarVisable] = useState(false)

    return (
    <div id="reminders-page-container">
    <div id="reminders-list-header">
    <button id="add-new-item-btn" className="btn btn-outline-secondary menu-button"> + </button>
      <img src={logo} id="logo-small-left" alt="Logo" className="menu-item"/>
    <button id="add-new-item-btn" className="btn btn-outline-secondary" onClick={()=>setSideBarVisable(!sideBarVisable)}><img src={sidebar} id="settings-small-left" alt="settings" className="menu-button"/></button>
    </div>
    <RemindersList/>

    <div id="side-panel" className={`${sideBarVisable? "visible" : "hidden" }`}>
      <p>Option 2</p>
      <p>Option 3</p>
      <p>Option 4</p>
      <p>Option 5</p>
    <input type="checkbox" checked data-toggle="toggle"/>
    </div>
    
    </div>

  )
}
