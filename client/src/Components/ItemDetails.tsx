import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addReminder, deleteReminder } from "../Utilities/ServerRequests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { ReminderType } from "../Utilities/types";
import dayjs from "dayjs";
import { notify } from "../Utilities/notifications";

// Zod schema
const itemSchema = z
  .object({
    date: z
      .string()
      .refine((val) => {
        const parsedDate = dayjs(val);
        return parsedDate.isValid();
      }, {
        message: "Invalid date format",
      }),
    title: z.string().min(1, "Cannot be empty").max(500, "Max 500 characters"),
    unit_count: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (typeof val === 'string') {
          return val ? parseInt(val, 10) : undefined;
        }
        return val;
      }),
    unit_time: z.enum(["day", "week", "month", "year"]).nullable(),
    recurring: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.recurring) {
      if (data.unit_count === undefined) {
        ctx.addIssue({
          path: ["unit_count"],
          message: "Unit count is required when recurring is true",
          code: "custom",
        });
      }
      if (!data.unit_time) {
        ctx.addIssue({
          path: ["unit_time"],
          message: "Unit time is required when recurring is true",
          code: "custom",
        });
      }
    } else {
      data.unit_count = undefined;
      data.unit_time = "day";
    }
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
    formState,
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
      unit_time: "day",
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
        reminder_date: data.date
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
        notify("Reminder Added!!","success")
        setEdited(false);
      }

      if (active) {
        notify("Reminder Updated!!","success")
        setEdited(false);
      }
    } catch (error) {
        notify("Error adding reminder","error")
        setReminderData((previousData) =>
        previousData?.filter((item) => item.pk_reminder_id !== -1)
      );
    }
  };

  const onCancel = () => {
    setActive(undefined); 
    resetFormToBlank();
    setBottomBarVisible(false);
    setEdited(false);
  };

  const onDelete = async () => {
    if (!active) {
      notify("Failed to delete","error")
      return;
    }

    setReminderData((previousData) =>
      previousData?.filter((item) => item.pk_reminder_id !== active.pk_reminder_id)
    );

    try {
      await deleteReminder(active.pk_reminder_id);
      notify("Reminder deleted","success");
      resetFormToBlank();
      setEdited(false);
    } catch (error) {
      setReminderData((previousData) => [...(previousData || []), active]);
      notify("Failed to delete","error")
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
          <div className="row mt-1 w-100 mx-0">
            <h6 className="text-center">Every</h6>
            {/* Unit Count */}
            <div className="col-6 ms-0">
              <input
                {...register("unit_count")}
                id="unit_count"
                type="number"
                max="365"
                min="1"
                className="form-control"
                disabled={!recurring}
                              />
              {errors.unit_count && <p className="text-danger">{errors.unit_count.message}</p>}
            </div>

            {/* Unit Time */}
            <div className="col-6 ms-0">
              <select
                {...register("unit_time")}
                id="unit_time"
                className="form-control"
                defaultValue="day"
                disabled={!recurring}
              >
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
                <option value="month">Month(s)</option>
                <option value="year">Year(s)</option>
              </select>
              {errors.unit_time && <p className="text-danger">{errors.unit_time.message}</p>}
            </div>
          </div>

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
