import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(4,"Username must be at least 4 characters long")
    .max(20,"Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/,"Username can only contain letters and numbers")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
        .string()
        .email({message: "Invalid email address"})
        .max(50,"Email must be at most 50 characters long"),
    password: z
        .string()
        .min(6,{message: "Password must be at least 6 characters long"})
})
