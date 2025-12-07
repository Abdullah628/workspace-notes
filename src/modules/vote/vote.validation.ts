import { z } from "zod";

export const createOrUpdateVoteSchema = z.object({
  body: z.object({
    noteId: z.string().min(1),
    type: z.enum(["up", "down"]),
    voterUserId: z.string().optional(),
    voterCompanyId: z.string().optional(),
  })
});

export const getVotesByNoteSchema = z.object({
  params: z.object({ noteId: z.string().min(1) })
});

export const deleteVoteSchema = z.object({
  params: z.object({ noteId: z.string().min(1) }),
  body: z.object({
    voterUserId: z.string().optional(),
    voterCompanyId: z.string().optional(),
  })
});
