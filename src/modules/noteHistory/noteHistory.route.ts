import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { getHistoryByNoteSchema } from "./noteHistory.validation";
import { NoteHistoryControllers } from "./noteHistory.controller";

const router = Router();

router.get("/note/:noteId", checkAuth(), validateRequest(getHistoryByNoteSchema), NoteHistoryControllers.getHistoryByNote);
router.get("/:id", checkAuth(), NoteHistoryControllers.getHistoryById);

export const NoteHistoryRoutes = router;
