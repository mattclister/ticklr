import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { ReminderType } from "../Utilities/types";
import dayjs from 'dayjs';
import React from "react";

interface Props {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<ReminderType | undefined>>;
  active: ReminderType | undefined;
  reminderdata: ReminderType[] | undefined;
  setReminderData: React.Dispatch<React.SetStateAction<ReminderType[] | undefined>>
}

export const RemindersList = ({ setBottomBarVisible, setActive, active, reminderdata, setReminderData}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  const activehandler = (reminderdata: ReminderType[], id: Number) => {
    setActive(reminderdata.filter((item) => item.pk_reminder_id === id)[0])
    setBottomBarVisible(true)
  }

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log(`Fetching Reminders...`);
        const requestedData:ReminderType[] = await getReminders();
        setReminderData(requestedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const onAddNew = () => {
    setActive(undefined)
    setBottomBarVisible(true)
  }

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
              className={`list-group-item${item.pk_reminder_id === active?.pk_reminder_id ? " active" : ""}`}
              key={item.pk_reminder_id.toString()}
              onClick={() => {
                console.log("clicked");
                console.log(item.pk_reminder_id);
                console.log(reminderdata);
                activehandler(reminderdata,item.pk_reminder_id)}}
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
              onClick={() => onAddNew()}
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
