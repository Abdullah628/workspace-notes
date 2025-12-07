import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createOrUpdateVoteSchema, getVotesByNoteSchema, deleteVoteSchema } from "./vote.validation";
import { VoteControllers } from "./vote.controller";

const router = Router();

router.post("/", validateRequest(createOrUpdateVoteSchema), VoteControllers.createOrUpdateVote);
router.get("/note/:noteId", validateRequest(getVotesByNoteSchema), VoteControllers.getVotesByNote);
router.delete("/note/:noteId", validateRequest(deleteVoteSchema), VoteControllers.deleteVote);

export const VoteRoutes = router;
