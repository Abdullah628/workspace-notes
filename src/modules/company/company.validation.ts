import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    domain: z.string().optional(),
  })
});

export const updateCompanySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    domain: z.string().optional(),
  })
});
