import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createNoteSchema, updateNoteSchema, listPublicNotesSchema, listWorkspaceNotesSchema, restoreHistorySchema } from "./note.validation";
import { NoteControllers } from "./note.controller";

const router = Router();

// Public directory
router.get("/public", validateRequest(listPublicNotesSchema), NoteControllers.listPublicNotes);

router.post("/", checkAuth(), validateRequest(createNoteSchema), NoteControllers.createNote);
router.get("/:id", checkAuth(), NoteControllers.getNote);
router.patch("/:id", checkAuth(), validateRequest(updateNoteSchema), NoteControllers.updateNote);
router.delete("/:id", checkAuth(), NoteControllers.deleteNote);
router.get("/workspace/:workspaceId", checkAuth(), validateRequest(listWorkspaceNotesSchema), NoteControllers.listWorkspaceNotes);



// History restore
router.post("/:id/history/:historyId/restore", checkAuth(), validateRequest(restoreHistorySchema), NoteControllers.restoreHistory);

export const NoteRoutes = router;
