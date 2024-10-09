import { TimeZones, timeZoneCodesArray } from "./TimeZones";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs"

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

const schema = z.object({
  userEmail: z.string().min(3).max(32).email("Invalid email format"),
  createPassword: passwordValidation,
  confirmPassword: z.string().min(8, "Please confirm your password"),
  timeZone: z.enum(timeZoneCodesArray),
}).refine((data) => data.createPassword === data.confirmPassword, {message: "Passwords do not match", path: ["confirmPassword"]});

// Using the above schema to create a type for the FormData
type FormData = z.infer<typeof schema>;

export const UserRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange", reValidateMode: "onChange"  });

  return (
    <>
      <h2>Register</h2>
      <form
        id="registrationForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Enter Email */}

        <label className="form-label" htmlFor="userEmail">
          Email
        </label>
        <input
          {...register("userEmail")}
          id="userEmail"
          className="form-control"
          type="email"
        ></input>
        {errors.userEmail && (
          <p className="text-danger">{errors.userEmail.message}</p>
        )}


        {/* Create Password */}

        <label className="form-label" htmlFor="createPassword">
          Create Password{" "}
        </label>
        <input
          {...register("createPassword")}
          id="createPassword"
          className="form-control"
          type="password"
        ></input>
        {errors.createPassword && (
          <p className="text-danger">{errors.createPassword.message}</p>
        )}

        {/* Confirm Password */}

        <label className="form-label" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          className="form-control"
          type="password"
        ></input>
        {errors.confirmPassword && (
          <p className="text-danger">{errors.confirmPassword.message}</p>
        )}

        {/* Select Timezone */}

        <label className="form-label" htmlFor="timeZone">
          Time Zone
        </label>
        <select
          {...register("timeZone")}
          id="timeZone"
          className="form-select f rm-select-md mb-3"
          defaultValue="UTC"
        >
          {TimeZones.map((item, index) => (
            <option key={index} value={item.TimeZoneCode}>
              {item.TimeZoneCode} - {item.TimeZone} - {item.UTCText}
            </option>
          ))}
        </select>
        {errors.timeZone && (
          <p className="text-danger">{errors.timeZone.message}</p>
        )}

{/* Submit Button */}

        <button disabled={!isValid} type="submit" className="btn btn-primary w-100 login-btn">
          Sign Up
        </button>
      </form>
    </>
  );
};

// On Submit 

const onSubmit = async (data: FormData) => {
  const hashedPassword = await bcrypt.hash(data.createPassword, 10);

  const formDataPacket = {
    ...data,
    createPassword: hashedPassword,
    confirmPassword: undefined,
  };

  console.log(formDataPacket);
};
