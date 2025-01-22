import { useState, useEffect } from "react";
import { getReminders } from "../Utilities/ServerRequests";
import { ReminderType } from "../Utilities/types";
import dayjs from "dayjs";
import React from "react";
import { notify } from "../Utilities/notifications";
import { Dropdown } from "react-bootstrap";
import more from "../assets/more.png";

const handleSelect = (eventKey: any) => {
  console.log(`Selected: ${eventKey}`);
};

interface Props {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<ReminderType | undefined>>;
  active: ReminderType | undefined;
  reminderdata: ReminderType[] | undefined;
  setReminderData: React.Dispatch<
    React.SetStateAction<ReminderType[] | undefined>
  >;
  setTopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  bottomBarVisible: boolean;
  topBarVisible: boolean;
}

export const RemindersList = ({
  setBottomBarVisible,
  setActive,
  active,
  reminderdata,
  setReminderData,
  bottomBarVisible,
  topBarVisible,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const activehandler = (reminderdata: ReminderType[], id: Number) => {
    setActive(reminderdata.filter((item) => item.pk_reminder_id === id)[0]);
  };

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log(`Fetching Reminders...`);
        const requestedData: ReminderType[] = await getReminders();
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
    setActive(undefined);
    setBottomBarVisible(true);
  };

  if (loading) {
    return <p>loading...</p>;
  } else {
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
            {reminderdata
              .sort(
                (a, b) =>
                  dayjs(a.reminder_date).valueOf() -
                  dayjs(b.reminder_date).valueOf()
              )
              .map((item) => (
                <li
                  className={`list-group-item${
                    item.pk_reminder_id === active?.pk_reminder_id
                      ? " selected"
                      : ""
                  }`}
                  key={item.pk_reminder_id.toString()}
                  onClick={() => {
                    console.log(item.pk_reminder_id);
                    activehandler(reminderdata, item.pk_reminder_id);
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col">
                      <h6>
                      {item.reminder_date===null? dayjs(item.date as string).format("DD-MMM"):
                        dayjs(item.reminder_date as string).format("DD-MMM")}
                      </h6>
                    </div>
                    <div className="col">
                  </div>
                    <div className="col-4">
                      {item.title.length > 40
                        ? item.title.slice(0, 40) + "..."
                        : item.title}
                    </div>
                    <div className="col">
                      {item.unit_count && item.unit_time
                        ? `${item.unit_count} ${item.unit_time}s`
                        : ""}
                    </div>
                    <div className="col d-flex align-items-center justify-content-center">
                      {item.pk_reminder_id === active?.pk_reminder_id ? (
                        <Dropdown onSelect={handleSelect}>
                          <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                          ><img src={more} alt="more-options" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={()=>notify("Item Deleted","warn")}>Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </li>
              ))}
            <li id="add-new-item-row" className="list-group-item no-highlight">
              {" "}
              <button
                id="add-new-item-btn"
                onClick={() => onAddNew()}
                className="btn btn-outline-secondary"
              >
                + add new item
              </button>
            </li>
            {bottomBarVisible || topBarVisible ? (
              <li
                className="list-group-item no-highlight"
                style={{ borderColor: "transparent" }}
              >
                <div
                  id="blank_div"
                  style={{
                    height: "55vh",
                    maxHeight: "430px",
                    minHeight: "400px",
                  }}
                ></div>
              </li>
            ) : null}
          </ul>
        )}
      </>
    );
  }
};
