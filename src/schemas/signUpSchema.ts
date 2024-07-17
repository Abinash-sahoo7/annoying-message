import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "username must be no more than 20 character")
  .regex(
    /^[A-Za-z][A-Za-z0-9_]{7,29}$/,
    "Username must not contain special character"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  Password: z.string().min(6, { message: "Password must be 6 character" }),
});
