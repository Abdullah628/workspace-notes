import { Types } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Vote, VoteType } from "./vote.model";
import { Note } from "../note/note.model";

const createOrUpdateVote = async (payload: {
  noteId: Types.ObjectId | string;
  voterUserId: Types.ObjectId | string;
  type: VoteType;
}) => {
  // Verify note exists and is public
  const note = await Note.findById(payload.noteId);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }
  
  if (note.type !== "public" || note.isDraft) {
    throw new AppError(httpStatus.FORBIDDEN, "Can only vote on public published notes");
  }

  // Upsert vote (update if exists, create if not)
  await Vote.findOneAndUpdate(
    { noteId: payload.noteId, voterUserId: payload.voterUserId },
    { type: payload.type },
    { upsert: true, new: true }
  );

  // Recalculate counts
  const upCount = await Vote.countDocuments({ noteId: payload.noteId, type: "up" });
  const downCount = await Vote.countDocuments({ noteId: payload.noteId, type: "down" });
  await Note.findByIdAndUpdate(payload.noteId, { upvotes: upCount, downvotes: downCount });

  return { upvotes: upCount, downvotes: downCount };
};

const getVotesByNote = async (noteId: string) => {
  return Vote.find({ noteId }).populate("voterUserId");
};

const deleteVote = async (noteId: string, voterUserId: string) => {
  await Vote.findOneAndDelete({ noteId, voterUserId });

  // Recalculate counts
  const upCount = await Vote.countDocuments({ noteId, type: "up" });
  const downCount = await Vote.countDocuments({ noteId, type: "down" });
  await Note.findByIdAndUpdate(noteId, { upvotes: upCount, downvotes: downCount });

  return { upvotes: upCount, downvotes: downCount };
};

export const VoteServices = {
  createOrUpdateVote,
  getVotesByNote,
  deleteVote,
};
