import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
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
  title: z.string().min(1, "Cannot be empty").max(500, "Max 500 characters"),
  unit_count: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 365, {
      message: "Must be between 1 and 365",
    }),
  unit_time: z.enum(["day", "week", "month", "year"]),
  recurring: z.boolean(),
});

type ItemDetailsProps = {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<ReminderType | undefined>>;
  active: ReminderType | undefined;
  setReminderData: React.Dispatch<React.SetStateAction<ReminderType[] | undefined>>;
};

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
    formState: { errors, isDirty },
    watch,
  } = useForm<ReminderType>({
    resolver: zodResolver(itemSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [edited, setEdited] = useState(false);
  const [successMessage, setSuccessMessage] = useState(" ");
  const [tempID, setTempId] = useState<number>(-1);

  // Side effects to run if an active item is selected
  useEffect(() => {
    if (active) {
      reset({
        date: dayjs(active.date as string).format("YYYY-MM-DD"),
        title: active.title,
        unit_count: active.unit_count,
        unit_time: active.unit_time,
        recurring: active.recurring,
      });
    } else {
      resetFormToBlank();
    }
  }, [active, reset]);

  // Reset form to default/blank values
  const resetFormToBlank = () => {
    reset({
      title: "",
      date: "",
      unit_time: undefined,
      unit_count: undefined,
      recurring: false,
    });
  };

  const onSubmit = async (data: ReminderType) => {
    const newTempID = tempID;
    try {
      const submissionData: ReminderType = {
        ...data,
        pk_reminder_id: active?.pk_reminder_id ? active.pk_reminder_id : newTempID,
      };

      // Optimistically update state and GUI
      if (!active) {
        setReminderData((previousData) => [
          ...previousData || [],
          submissionData,
        ]);
      } else {
        setReminderData((previousData) =>
          previousData?.map((item) =>
            item.pk_reminder_id === active.pk_reminder_id
              ? { ...item, ...submissionData }
              : item
          )
        );
      }

      setTempId((prevTempId) => prevTempId - 1);

      const res = await addReminder(submissionData);
      setReminderData((previousData) =>
        previousData?.map((item) =>
          item.pk_reminder_id === newTempID
            ? { ...item, pk_reminder_id: res.pk_reminder_id, fk_user_id: res.fk_user_id }
            : item
        )
      );

      if (!active) {
        resetFormToBlank();
        setSuccessMessage("Reminder Added!!");
        setEdited(false);
      }

      if (active) {
        setSuccessMessage("Reminder Updated!!");
        setEdited(false);
      }
    } catch (error) {
      console.error("Error adding reminder:", error);
      setSuccessMessage("Failed to update");
      setReminderData((previousData) =>
        previousData?.filter((item) => item.pk_reminder_id !== -1)
      );
    }
  };

  const onCancel = () => {
    setActive(undefined); 
    resetFormToBlank();
    setBottomBarVisible(false);
    setSuccessMessage(" "); 
    setEdited(false);
  };

  const onDelete = async () => {
    if (!active) {
      console.error("No active reminder selected for deletion.");
      return;
    }

    setReminderData((previousData) =>
      previousData?.filter((item) => item.pk_reminder_id !== active.pk_reminder_id)
    );

    try {
      await deleteReminder(active.pk_reminder_id);
      setSuccessMessage("Reminder Deleted");
      resetFormToBlank();
      setEdited(false);
    } catch (error) {
      setReminderData((previousData) => [...(previousData || []), active]);
      console.error("Failed to delete reminder:", error);
      setSuccessMessage("Failed to delete reminder");
    }
  };

  // Watch for changes in recurring switch
  const recurring = watch("recurring");

  return (
    <div className="container text-center">
      <h3>{active ? "Update" : "Add New"}</h3>
      <form id="addReminder" onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-1 w-100 mx-0">
          {/* Start Date */}
          <div className="col-4 ms-0">
            <label className="form-label" htmlFor="Date">
              Date
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  id="DatePickerField"
                  className="form-control w-100"
                  selected={
                    field.value && dayjs(field.value, "YYYY-MM-DD").isValid()
                      ? dayjs(field.value, "YYYY-MM-DD").toDate()
                      : null
                  }
                  onChange={(date: Date | null) => {
                    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
                    field.onChange(formattedDate);
                  }}
                  dateFormat="dd/MM/YYYY"
                  placeholderText="Select a date"
                />
              )}
            />
            {errors.date && <p className="text-danger">{errors.date.message}</p>}
          </div>

          {/* Title */}
          <div className="col-6 ms-0">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              {...register("title")}
              id="Reminder"
              className="form-control"
              type="text"
            />
            {errors.title && <p className="text-danger">{errors.title.message}</p>}
          </div>

          {/* Recurring Switch */}
          <div className="col-2">
          <label className="form-label" htmlFor="recurring-check">Recurs</label>
          <div className="form-check form-switch custom-switch">
            <input
              {...register("recurring")}
              id="recurring-check"
              type="checkbox"
              className="form-check-input"
            />
          </div>
          </div>
        </div>

        {/* Recurs Section: Display only when recurring is checked */}
        {recurring && (
          <div className="row mt-1 w-100 mx-0">
            {/* Unit Count */}
            <div className="col-6 ms-0">
              <label className="form-label" htmlFor="unit_count">
                Recurs
              </label>
              <input
                {...register("unit_count")}
                id="unit_count"
                className="form-control"
                type="number"
              />
              {errors.unit_count && <p className="text-danger">{errors.unit_count.message}</p>}
            </div>

            {/* Unit Time */}
            <div className="col-6 ms-0">
              <label className="form-label" htmlFor="unit_time">
                Frequency
              </label>
              <select
                {...register("unit_time")}
                id="unit_time"
                className="form-control"
                defaultValue="day"
              >
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
                <option value="month">Month(s)</option>
                <option value="year">Year(s)</option>
              </select>
              {errors.unit_time && <p className="text-danger">{errors.unit_time.message}</p>}
            </div>
          </div>
        )}

        {/* Submit and Cancel Buttons */}
        <div>
          {active ? (
            <div>
              <button
                type="button"
                onClick={() => onCancel()}
                className="btn btn-outline-warning w-100 mt-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete()}
                className="btn btn-outline-danger w-100 mt-3"
              >
                Delete
              </button>
              <button
                type="submit"
                disabled={!isDirty}
                className="btn btn-primary w-100 mt-3"
              >
                Update
              </button>
            </div>
          ) : (
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
                disabled={!isDirty}
                className="btn btn-primary w-100 mt-3"
              >
                Add New
              </button>
            </div>
          )}
        </div>
      </form>
      <div>{successMessage && <p className="text-success">{successMessage}</p>}</div>
    </div>
  );
};
