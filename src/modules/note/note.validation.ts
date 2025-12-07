import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    workspaceId: z.string().min(1),
    companyId: z.string().min(1).optional(),
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    tags: z.array(z.string()).default([]),
    type: z.enum(["public", "private"]).default("private"),
    isDraft: z.boolean().default(false),
  })
});

export const updateNoteSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    type: z.enum(["public", "private"]).optional(),
    isDraft: z.boolean().optional(),
  })
});

export const listWorkspaceNotesSchema = z.object({
  params: z.object({ workspaceId: z.string().min(1) }),
  query: z.object({ q: z.string().optional() })
});

export const listPublicNotesSchema = z.object({
  query: z.object({ q: z.string().optional(), sort: z.enum(["new", "old", "upvotes", "downvotes"]).optional() })
});

export const restoreHistorySchema = z.object({
  params: z.object({ id: z.string().min(1), historyId: z.string().min(1) })
});
