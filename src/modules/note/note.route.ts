import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createNoteSchema, updateNoteSchema, listPublicNotesSchema, listWorkspaceNotesSchema, restoreHistorySchema } from "./note.validation";
import { NoteControllers } from "./note.controller";

const router = Router();

router.post("/", checkAuth(), validateRequest(createNoteSchema), NoteControllers.createNote);
router.get("/:id", checkAuth(), NoteControllers.getNote);
router.patch("/:id", checkAuth(), validateRequest(updateNoteSchema), NoteControllers.updateNote);
router.get("/workspace/:workspaceId", checkAuth(), validateRequest(listWorkspaceNotesSchema), NoteControllers.listWorkspaceNotes);

// Public directory
router.get("/public", validateRequest(listPublicNotesSchema), NoteControllers.listPublicNotes);

// History restore
router.post("/:id/history/:historyId/restore", checkAuth(), validateRequest(restoreHistorySchema), NoteControllers.restoreHistory);

export const NoteRoutes = router;
