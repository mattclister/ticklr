import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addReminder } from "../Utilities/ServerRequests";
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
});

export type NewReminderType = z.infer<typeof itemSchema>;

type ItemDetailsProps = {
  setBottomBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<ReminderType | undefined>>;
  ReRenderRemindersList: () => void;
  updateMode: boolean;
  active: ReminderType | undefined;
};

export const ItemDetails = ({
  setBottomBarVisible,
  ReRenderRemindersList,
  setActive,
  updateMode,
  active,
}: ItemDetailsProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewReminderType>({
    resolver: zodResolver(itemSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const conversions = {
      w: "week",
      d: "day",
      m: "month",
      y: "year",
    } as const;

    if (active) {
      const unitkey = active.recurs?.slice(-1) as keyof typeof conversions;

      if (unitkey && conversions[unitkey]) {
        reset({
          date: dayjs(active.date as string).format("DD/MM/YY"),
          reminder: active.title,
          number: active.recurs.slice(0, -1) as unknown as number,
          unit_time: conversions[unitkey],
        });
      } else {
        console.warn(`Invalid unit in recurs: ${unitkey}`);
        resetFormToBlank();
      }
    }

    if (!active) {
      console.log("no active reminder, reseting...");
      resetFormToBlank();
      console.log(active);
    }
  }, [active, reset]);

  const resetFormToBlank = () =>
    reset({
      date: "",
      reminder: "",
      number: "" as unknown as number,
      unit_time: "day",
    });

  const onSubmit = async (data: NewReminderType) => {
    try {
      await addReminder(data);
      ReRenderRemindersList();
      resetFormToBlank();
      setSuccessMessage("Reminder Added!!");
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const onCancel = () => {
    setBottomBarVisible(false); // Hides items details
    setActive(undefined); // Sets the "active" reminder to blank
    resetFormToBlank();
    setSuccessMessage(""); // Removes any "Reminder added message"
  };

  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="container text-center">
      <p className="text-success">{successMessage}</p>
      <form id="addReminder" onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-1 w-100 mw-100 mx-0 px-0">
          <div className="col-5 ms-0">
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
                  className="form-control w-100 mw-100"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => {
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : ""
                    );
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                />
              )}
            />
            {errors.date && (
              <p className="text-danger">{errors.date.message}</p>
            )}
          </div>
          <div className="col-3">
            <label className="form-label">Recurs</label>
            <input
              {...register("number")}
              id="Number"
              placeholder="Number"
              className="form-control"
              type="number"
              min="1"
              max="365"
            />
            {errors.number && (
              <p className="text-danger">{errors.number.message}</p>
            )}
          </div>
          <div className="col-4 me-0">
            <label className="form-label">Every</label>
            <select
              {...register("unit_time")}
              id="unit_time"
              className="form-control"
              defaultValue="Day"
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
          <label className="form-label" htmlFor="Reminder">
            Reminder
          </label>
          <input
            {...register("reminder")}
            id="Reminder"
            className="form-control"
            type="text"
          />
          {errors.reminder && (
            <p className="text-danger">{errors.reminder.message}</p>
          )}
        </div>

        {!active ? (
          <div>
            <button
              type="button"
              onClick={() => onCancel()}
              className="btn btn-warning w-100 mt-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100 login-btn">
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
              className="btn btn-warning w-100 mt-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-danger w-100 login-btn">
              Delete
            </button>
            </div>
            <button type="submit" className="btn btn-primary w-100 login-btn">
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
