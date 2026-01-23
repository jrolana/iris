import * as z from "zod";

// schemas: for validating forms, API requests, etc.

export const UserSchema = z.object({
    full_name: z.string(),
    email: z.email()
    .trim()
    .toLowerCase()
    .refine((email) => email.endsWith("up.edu.ph"), {message: "Email must be a UP mail address."}),
    role: z.enum(["admin", "techgen", "up-official"]).default("techgen"),
    college: z.string().max(20).default("Other"),
    is_active: z.boolean().default(true),
});

export const InviteUserSchema = UserSchema.pick({
  email: true,
  role: true,
})

export type InviteUserType = z.infer<typeof InviteUserSchema>