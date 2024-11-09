import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { formatedDate, TimeZone } from "./TimeZones";

// This needs to take data as a propery into the component

interface Props {
  setBottomBarVisable: React.Dispatch<React.SetStateAction<boolean>>;
  userID: string | undefined;
}

export const RemindersList = ({ setBottomBarVisable, userID }: Props) => {
  const [reminderdata, setReminderData] = useState();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReminders = () => {
      try {
        const requestedData = getReminders(userID);
        setReminderData(requestedData);
        console.log(requestedData);
        console.log(reminderdata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false);
      }
    };
  });

  return (
    <>
      {reminderdata === undefined ? (
        <li className="list-group-item">
          {" "}
          <button
            id="add-new-item-btn"
            onClick={() => setBottomBarVisable(true)}
            className="btn btn-outline-secondary"
          >
            + add new item
          </button>
        </li>
      ) : (
        <ul id="reminders-list" className="list-group">
          {reminderdata.map((item) => (
            <li className="list-group-item" key={item.id}>
              <div className="row align-items-start">
                <div className="col">
                  <h6>
                    {item.reminderdata.day} {item.reminderdata.monthTxt}
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
              onClick={() => setBottomBarVisable(true)}
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
