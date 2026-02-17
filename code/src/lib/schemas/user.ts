import * as z from "zod";

// schemas: for validating forms, API requests, etc.

export const UserSchemaBase = z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    email: z.email("Invalid email")
    .trim()
    .toLowerCase()
    .min(1, "Email is required"),
    role: z.enum(["admin", "techgen", "up-official"]).default("techgen"),
    college_code: z.string().max(20).optional(),
    other_college_name: z.string().optional(),
    external_institution: z.string().optional(),
})

export const UserSchema = UserSchemaBase
  .superRefine((data, ctx) => {
      if (!data.external_institution && !data.email.endsWith("up.edu.ph")) {
        ctx.addIssue({
          code: "custom",
          message: "Email must be a UP mail address.",
          path: ["email"],  
        });
      }

      if (data.college_code == "Other" && !data.other_college_name) {
        ctx.addIssue({
          code: "custom",
          message: "Unit is required.",
          path: ["otherCollegeName"]
        })
      }

      if ((!data.college_code && !data.other_college_name) && !data.external_institution) {
        ctx.addIssue({
          code: "custom",
          message: "Institution is required",
          path: ["externalInstitution"]
        })
      }
  });

export const UserRegistrationSchema = UserSchema.extend({
  status: z.literal("pending").default("pending"),
  approved_at: z.null().default(null),
})
.transform(
  (data) => ({
    ...data,
    full_name: `${data.first_name} ${data.last_name}`
  })
);

export type UserType = z.infer<typeof UserSchema>
export type UserRegistrationType = z.infer<typeof UserRegistrationSchema>

export const InviteUserSchema = UserSchemaBase.pick({
  email: true,
  role: true,
})

export type InviteUserType = z.infer<typeof InviteUserSchema>