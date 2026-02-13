import { z } from "zod";

export const registerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastname: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().min(3).optional(),
});
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const googleAuthSchema = z.object({
  email: z.string().email(),
  googleId: z.string().min(5),
});
