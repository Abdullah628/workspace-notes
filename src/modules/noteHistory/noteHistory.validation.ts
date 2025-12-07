import { z } from "zod";

export const getHistoryByNoteSchema = z.object({
  params: z.object({ noteId: z.string().min(1) })
});
