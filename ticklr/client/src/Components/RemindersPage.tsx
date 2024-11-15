import { useState } from "react"
import { RemindersList } from "./RemindersList"
import Settings from "./Settings"
import logo from "../assets/ticklrLogo.png"
import topbar from "../assets/list.svg"
import { ItemDetails } from "./ItemDetails"

interface RemindersPageProps {
  handleLogOut: () => void,
}

export const RemindersPage = ({handleLogOut}: RemindersPageProps) => {
  
  const [topBarVisable, settopBarVisable] = useState(false)
  const [bottomBarVisable, setBottomBarVisable] = useState(false)

    return (
    <div id="reminders-page-container">
    <div id="reminders-list-header">
    <button id="add-new-item-menu-btn" className="btn btn-outline-secondary menu-button" onClick={()=>{setBottomBarVisable(!bottomBarVisable); settopBarVisable(false)}}> + </button>
      <img src={logo} id="logo-small-left" alt="Logo" className="menu-item"/>
    <button id="add-new-item-btn" className="btn btn-outline-secondary menu-button" onClick={()=>{settopBarVisable(!topBarVisable); setBottomBarVisable(false)}}><img src={topbar} id="settings-small-left" alt="settings" className="menu-button"/></button>
    </div>
    <RemindersList setBottomBarVisable={setBottomBarVisable}/>
    <div id="details-panel" className={`${bottomBarVisable? "visible" : "hidden" }`}>
    <ItemDetails/>
    </div>
    <div id="settings-panel" className={`${topBarVisable? "visible" : "hidden" }`}>
    <Settings handleLogOut={handleLogOut}/>
    </div>
    </div>
  )
}
