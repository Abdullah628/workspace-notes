import z from "zod";
import { IsActive, Role } from "./user.interface";
import { objectIdRegex } from "../../interfaces/common";

export const createUserZodSchema = z.object({
  body: z.object({
    companyName: z
      .string({ message: "Company name must be string" })
      .min(2, { message: "Company name must be at least 2 characters long." })
      .max(100, { message: "Company name cannot exceed 100 characters." }),
    
    name: z
      .string({ message: "Name must be string" })
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(100, { message: "Name cannot exceed 100 characters." }),

    email: z
      .string({ message: "Email must be string" })
      .email({ message: "Invalid email address format." })
      .min(5, { message: "Email must be at least 5 characters long." })
      .max(100, { message: "Email cannot exceed 100 characters." }),
    
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

export const updateUserZodSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    name: z
      .string({ message: "Name must be string" })
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(100, { message: "Name cannot exceed 100 characters." })
      .optional(),
    
    email: z
      .string({ message: "Email must be string" })
      .email({ message: "Invalid email address format." })
      .min(5, { message: "Email must be at least 5 characters long." })
      .max(100, { message: "Email cannot exceed 100 characters." })
      .optional(),
    
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
      })
      .optional(),
    
    role: z.nativeEnum(Role).optional(),
    
    isActive: z.nativeEnum(IsActive).optional(),
  })
});
