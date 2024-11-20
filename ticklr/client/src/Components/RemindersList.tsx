import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { ReminderType } from "../Utilities/types";

interface Props {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RemindersList = ({ setBottomBarVisible}: Props) => {
  const [reminderdata, setReminderData] = useState<ReminderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log(`Fetching Reminders...`)
        const requestedData = await getReminders();
        console.log(requestedData)
        setReminderData(requestedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false);
      }
    };
    fetchReminders()
  },[]);

  return (
    <>
      {reminderdata === undefined ? (
        <li className="list-group-item">
          {" "}
          <button
            id="add-new-item-btn"
            onClick={() => setBottomBarVisible(true)}
            className="btn btn-outline-secondary"
          >
            + add new item
          </button>
        </li>
      ) : (
        <ul id="reminders-list" className="list-group">
          {reminderdata.map((item) => (
            <li className="list-group-item" key={item.pk_reminder_id.toString()}>
              <div className="row align-items-start">
                <div className="col">
                  <h6>
                    {item.date}
                  </h6>
                </div>
                <div className="col">{item.title}</div>
                <div className="col">{item.recurs}</div>
              </div>
            </li>
          ))}
          <li className="list-group-item">
            {" "}
            <button
              id="add-new-item-btn"
              onClick={() => setBottomBarVisible(true)}
              className="btn btn-outline-secondary"
            >
              + add new item
            </button>
          </li>
        </ul>
      )}
    </>
  );
};
