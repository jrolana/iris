import * as z from "zod";

// schemas: for validating forms, API requests, etc.

export const UserSchemaBase = z.object({
    isExternal: z.boolean().default(false),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.email("Invalid email")
    .trim()
    .toLowerCase(),
    role: z.enum(["admin", "techgen", "up-official"]).default("techgen"),
    college: z.string().min(1, "College is required").max(20).default("Other"),
    collegeName: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
})

export const UserSchema = UserSchemaBase
  .superRefine((data, ctx) => {
      if (!data.isExternal && !data.email.endsWith("up.edu.ph")) {
        ctx.addIssue({
          code: "custom",
          message: "Email must be a UP mail address.",
          path: ["email"],  
        });
      }

      if (data.isExternal && !data.collegeName) {
        ctx.addIssue({
          code: "custom",
          message: "Institution is required.",
          path: ["collegeName"]
        })
      }

      if (data.college == "Other" && !data.collegeName) {
        ctx.addIssue({
          code: "custom",
          message: "Unit is required.",
          path: ["collegeName"]
        })
      }
  });

export type UserType = z.infer<typeof UserSchema>

export const InviteUserSchema = UserSchemaBase.pick({
  email: true,
  role: true,
})

export type InviteUserType = z.infer<typeof InviteUserSchema>