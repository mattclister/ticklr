import { useForm, Controller } from "react-hook-form";
import { boolean, unknown, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addReminder, deleteReminder } from "../Utilities/ServerRequests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { ReminderType } from "../Utilities/types";
import dayjs from "dayjs";

// Zod schema
const itemSchema = z.object({
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format",
  }),
  reminder: z.string().min(1, "Cannot be empty").max(500, "Max 500 characters"),
  number: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 365, {
      message: "Must be between 1 and 365",
    }),
  unit_time: z.enum(["day", "week", "month", "year"]),
  reccuring: z.boolean()
});

type ItemDetailsProps = {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<ReminderType | undefined>>;
  active: ReminderType | undefined;
  setReminderData: React.Dispatch<React.SetStateAction<ReminderType[] | undefined>>;
}

export const ItemDetails = ({
  setBottomBarVisible,
  setActive,
  active,
  setReminderData,
}: ItemDetailsProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    formState,
  } = useForm<ReminderType>({
    resolver: zodResolver(itemSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [edited, setEdited] = useState(false);

  // Side effects to run if an active item is selected. Coverting item to details format.

  useEffect(() => {

    if (active) {

        reset({
          date: dayjs(active.date as string).format("YYYY-MM-DD"),
          title: active.title,
          unit_count: active.unit_count,
          unit_time: active.unit_time
        });
      } else {
        resetFormToBlank();
      }
    if (!active) {
      console.log("no active reminder, reseting...");
      resetFormToBlank();
    }
  }, [active, reset]);

  // Clear Form

  const resetFormToBlank = () =>
    reset({
    title: undefined,
    date: undefined,
    reminder_date: undefined,
    unit_time: undefined,
    unit_count: undefined,
    files: undefined,
    recurring: false,
    body: undefined,
    });

  // Submission

  const [tempID,setTempId] = useState<number>(-1)

  const onSubmit = async (data: ReminderType) => {
    console.log(data)

    const newTempID = tempID
  
    try {
      // If active, set pk to active value else assign tempID
      const submissionData: ReminderType = {
        ...data,
        pk_reminder_id: active?.pk_reminder_id ? active.pk_reminder_id: newTempID,
        }

      setTempId(prevTempId => prevTempId - 1);

      // Optamistically update state and GUI

    if (!active){
      setReminderData(previousData => [
        ...previousData || [], 
        submissionData
    ]);}

    if (active) {
      setReminderData(previousData =>
        previousData?.map((item) =>
          item.pk_reminder_id === active.pk_reminder_id ? { ...item, ...submissionData} : item
        )
      );
    }
    
    await addReminder(submissionData).then((res) => {
      setReminderData((previousData) =>
        previousData?.map((item) =>
          item.pk_reminder_id === newTempID
            ? { ...item, pk_reminder_id: res.pk_reminder_id, fk_user_id: res.fk_user_id }
            : item
        )
      );
    });

      if (!active) {
        resetFormToBlank();
        setSuccessMessage("Reminder Added!!");
        setEdited(false);
      }
 
      if (active) {
        setSuccessMessage("Reminder Updated!!");
        setEdited(false);
      }
    } 
        
    catch (error) {
      console.error("Error adding reminder:", error);
      setSuccessMessage("Failed to update");

      // Return to previous state if server request fails
      setReminderData(previousData => 
      !previousData? undefined: [...previousData.filter((item)=>item.pk_reminder_id!==-1)]
    );
    }
  };

  // Cancelation

  const onCancel = () => {
    setActive(undefined); // Sets the "active" reminder to blank
    resetFormToBlank(); // Can't use reset() as resets to prefilled values. Used a custom function to clear the form.
    setBottomBarVisible(false); // Hides items details
    setSuccessMessage(" "); // Removes any "Reminder added message"
    setEdited(false);
  };

  // Deletion

  const onDelete = async () => {
    // Check active is not null
    if (!active) {
      console.error("No active reminder selected for deletion.");
      return;
    }
  
    // Optimistic delete
    setReminderData((previousData) => {
      if (!previousData) return [];
      return previousData.filter((item) => item.pk_reminder_id !== active.pk_reminder_id);
    });
  
    try {
      // Call delete
      await deleteReminder(active.pk_reminder_id);
      setSuccessMessage("Reminder Deleted");
      resetFormToBlank();
      setEdited(false);
    } catch (error) {
      // Rollback on failure
      setReminderData((previousData) => [
        ...(previousData || []),
        active,
      ]);
      console.error("Failed to delete reminder:", error);
      setSuccessMessage("Failed to delete reminder");
    }
  };
  
  // Set submission success message
  const [successMessage, setSuccessMessage] = useState(" ");

  // Handler for field changes. Controls button activation, and success message.

  const onChangeHandler = () => {
    setEdited(true);
    setSuccessMessage(" ");
  };

  // FORM JSX

  return (
    <div className="container text-center">
      <h3>{active? "Update": "Add New"}</h3>
      <form id="addReminder" onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-1 w-100 mw-100 mx-0 px-0">
          <div className="col-2 ms-0">
            <label className="form-label" htmlFor="Date">
              Start date
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  id="DatePickerField"
                  className="form-control w-100 mw-100"
                  selected={
                    field.value && dayjs(field.value, "YYYY-MM-DD").isValid()
                      ? dayjs(field.value, "YYYY-MM-DD").toDate()
                      : null
                  }
                  onChange={(date: Date | null) => {
                    const formattedDate = date
                      ? dayjs(date).format("YYYY-MM-DD")
                      : null;
                    field.onChange(formattedDate);
                    onChangeHandler();
                  }}
                  dateFormat="dd/MM/YYYY"
                  placeholderText="Select a date"
                />
              )}
            />
            {errors.date && (
              <p className="text-danger">{errors.date.message}</p>
            )}
          </div>
          <div className="col-2 ms-0">
          <label className="form-label">Reccuring?</label>
            <input
              {...register("recurring")}
              id="recurs"
              className="form-control"
              type="checkbox"
              value="true"
              defaultValue="false"
              onChange={() => onChangeHandler()}
            />

          </div>

          <div className="col-3">
            <label className="form-label">Recurs</label>
            <input
              {...register("unit_count")}
              id="Number"
              placeholder="Number"
              className="form-control"
              type="number"
              onChange={() => onChangeHandler()}
            />
            {errors.unit_count && (
              <p className="text-danger">{errors.unit_count.message}</p>
            )}
          </div>
          <div className="col-4 me-0">
            <label className="form-label" htmlFor="unit_time">Frequency</label>
            <select
              {...register("unit_time")}
              id="unit_time"
              className="form-control"
              defaultValue="Day"
              onChange={() => onChangeHandler()}
            >
              <option value="day">Day(s)</option>
              <option value="week">Week(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
            {errors.unit_time && (
              <p className="text-danger">{errors.unit_time.message}</p>
            )}
          </div>
        </div>
        <div className="row mx-1 mt-2">
          <label className="form-label" htmlFor="title">
            Reminder
          </label>
          <input
            {...register("title")}
            id="Reminder"
            className="form-control"
            type="text"
            onChange={() => onChangeHandler()}
          />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </div>

        {!active ? (
          <div>
            <button
              type="button"
              onClick={() => onCancel()}
              className="btn btn-outline-warning w-100 mt-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!edited}
              className="btn btn-primary w-100 login-btn"
            >
              Add New
            </button>
          </div>
        ) : (
          ""
        )}

        {active ? (
          <div>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                onClick={() => onCancel()}
                className="btn btn-outline-warning w-100 mt-3"
              >
                Cancel
              </button>
              <button type='button' onClick={()=>onDelete()} className="btn btn-outline-danger w-100 login-btn">
                Delete
              </button>
            </div>
            <button
              type="submit"
              disabled={!edited}
              className="btn btn-primary w-100 login-btn"
            >
              Update
            </button>
          </div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};
