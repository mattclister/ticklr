import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { ReminderType } from "../Utilities/types";

interface Props {
  setBottomBarVisable: React.Dispatch<React.SetStateAction<boolean>>;
  userID: string | undefined;
}

export const RemindersList = ({ setBottomBarVisable, userID }: Props) => {
  const [reminderdata, setReminderData] = useState<ReminderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log("Fetching Reminders")
        const requestedData = await getReminders(userID);
        console.log(requestedData);
        setReminderData(requestedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false);
      }
    };
    fetchReminders()
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
            <li className="list-group-item" key={item.id.toString()}>
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
