import z from "zod";

export const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email must be string" })
      .email({ message: "Invalid email address format." }),
    
    password: z
      .string({ message: "Password must be string" })
      .min(1, { message: "Password is required" }),
  })
});

export const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ message: "Old password must be string" })
      .min(1, { message: "Old password is required" }),
    
    newPassword: z
      .string({ message: "New password must be string" })
      .min(8, { message: "New password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "New password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "New password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "New password must contain at least 1 number.",
      }),
  })
});

export const setPasswordZodSchema = z.object({
  body: z.object({
    password: z
      .string({ message: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),
  })
});
