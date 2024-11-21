import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { ReminderType } from "../Utilities/types";
import dayjs from 'dayjs';
import React from "react";

interface Props {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<Number | undefined>>;
  active: Number | undefined;
  reminderdata: ReminderType[];
  setReminderData: React.Dispatch<React.SetStateAction<ReminderType[]>>
}

export const RemindersList = ({ setBottomBarVisible, setActive, active, reminderdata, setReminderData}: Props) => {
  // const [reminderdata, setReminderData] = useState<ReminderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log(`Fetching Reminders...`);
        const requestedData = await getReminders();
        console.log(requestedData);
        setReminderData(requestedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

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
        <ul id="reminders-list" className="list-group" >
          {reminderdata.map((item) => (
            <li
              className={`list-group-item${item.pk_reminder_id === active ? " active" : ""}`}
              key={item.pk_reminder_id.toString()}
              onClick={() => setActive(item.pk_reminder_id)}
            >
              <div className="row align-items-start">
                <div className="col">
                  <h6>{dayjs(item.date as string).format('DD-MMM')}</h6>
                </div>
                <div className="col">{item.title.length>40?item.title.slice(0,40)+"...":item.title}</div>
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
