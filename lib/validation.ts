import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({});

export type SignupSchema = z.infer<typeof signupSchema>;
