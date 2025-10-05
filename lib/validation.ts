import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .regex(
      /^[a-zA-Z]+(?: [a-zA-Z]+)+$/,
      "Enter your full name (first and last)"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
