import { useState } from "react";
import { RemindersList } from "./RemindersList";
import Settings from "./Settings";
import logo from "../assets/ticklrLogo.png";
import topbar from "../assets/list.svg";
import { ItemDetails } from "./ItemDetails";
import { ReminderType } from "../Utilities/types";

interface RemindersPageProps {
  handleLogOut: () => void;
}

export const RemindersPage = ({ handleLogOut }: RemindersPageProps) => {
  const [topBarVisible, settopBarVisible] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  const [remindersKey, setRemindersKey] = useState(0);
  const [active, setActive] = useState<Number | undefined>();
  const [reminderdata, setReminderData] = useState<ReminderType[]>([]);

  // Function to re-render remindersList
  const ReRenderRemindersList = () => {
    setRemindersKey((prevKey) => prevKey + 1);
  };

  return (
    <div id="reminders-page-container">
      <div id="reminders-list-header">
        <button
          id="add-new-item-menu-btn"
          className="btn btn-outline-secondary menu-button"
          onClick={() => {
            setBottomBarVisible(!bottomBarVisible);
            settopBarVisible(false);
          }}
        >
          {" "}
          +{" "}
        </button>
        <img src={logo} id="logo-small-left" alt="Logo" className="menu-item" />
        <button
          id="add-new-item-btn"
          className="btn btn-outline-secondary menu-button"
          onClick={() => {
            settopBarVisible(!topBarVisible);
            setBottomBarVisible(false);
          }}
        >
          <img
            src={topbar}
            id="settings-small-left"
            alt="settings"
            className="menu-button"
          />
        </button>
      </div>
      <RemindersList
        key={remindersKey}
        setBottomBarVisible={setBottomBarVisible}
        setActive={setActive}
        active={active}
        reminderdata={reminderdata}
        setReminderData={setReminderData}
      />
      <div
        id="details-panel"
        className={`${bottomBarVisible ? "visible" : "hidden"}`}
      >
        <ItemDetails
          setBottomBarVisible={setBottomBarVisible}
          ReRenderRemindersList={ReRenderRemindersList}
        />
      </div>
      <div
        id="settings-panel"
        className={`${topBarVisible ? "visible" : "hidden"}`}
      >
        <Settings handleLogOut={handleLogOut} />
      </div>
    </div>
  );
};
