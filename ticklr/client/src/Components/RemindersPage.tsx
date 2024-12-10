import { useState } from "react";
import { RemindersList } from "./RemindersList";
import Settings from "./Settings";
import logo from "../assets/ticklrLogo.png";
import topbar from "../assets/list.svg";
import { ItemDetails } from "./ItemDetails";
import { ReminderType } from "../Utilities/types";
import { AnimatePresence,motion } from "framer-motion";

interface RemindersPageProps {
  handleLogOut: () => void;
}

export const RemindersPage = ({ handleLogOut }: RemindersPageProps) => {
  const [topBarVisible, setTopBarVisible] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  const [remindersKey, setRemindersKey] = useState(0);
  const [active, setActive] = useState<ReminderType | undefined>();
  const [reminderdata, setReminderData] = useState<
    ReminderType[] | undefined
  >();

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
            setActive(undefined);
            setBottomBarVisible(true);
            setTopBarVisible(false);
          }}
        >
          {" "}
          +{" "}
        </button>
        <img src={logo} id="logo-small-left" alt="Logo" className="menu-item" />
        <button
          id="open-settings-menu-btn"
          className="btn btn-outline-secondary menu-button"
          onClick={() => {
            setTopBarVisible(true);
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
        setTopBarVisible={setTopBarVisible}
        topBarVisible={topBarVisible}
        bottomBarVisible={bottomBarVisible}
      />
        <AnimatePresence>
        {bottomBarVisible && (
        <motion.div
          id="details-panel"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            height: "55vh",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          <ItemDetails
            setBottomBarVisible={setBottomBarVisible}
            active={active}
            setActive={setActive}
            ReRenderRemindersList={ReRenderRemindersList}
          />
        </motion.div>)}
        </AnimatePresence>
        <AnimatePresence>
        {topBarVisible && (
        <motion.div
          id="settings-panel"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            height: "55vh",
            bottom: 0,
            left: 0,
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          <Settings
            handleLogOut={handleLogOut}
            settopBarVisible={setTopBarVisible}
          />
        </motion.div>)}
        </AnimatePresence>
      </div>
  );
};
