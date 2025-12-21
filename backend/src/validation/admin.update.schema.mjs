import { z } from "zod";

export const adminUpdateSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});
