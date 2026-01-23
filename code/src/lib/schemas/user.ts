import * as z from "zod";

// schemas: for validating forms, API requests, etc.

export const Userchema = z.object({
    full_name: z.string(),
    email: z.email()
    .trim()
    .toLowerCase()
    .refine((email) => email.endsWith("up.edu.ph"), {message: "Email must be a UP mail address."}),
    role: z.enum(["admin", "techgen", "up-official"]).default("admin"),
    college: z.string().max(20).default("Other"),
    is_active: z.boolean().default(true),
});

// usage with the UserType:
// const validated: UserInput = UserSchema.parse(req.body);

// const dbRow: UserType = {
//   ...validated,
//   id: generateId(), // if DB expects id
//   created_at: new Date(),
//   updated_at: new Date(),
// };