import { Types } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Vote, VoteType } from "./vote.model";
import { Note } from "../note/note.model";

const createOrUpdateVote = async (payload: {
  noteId: Types.ObjectId | string;
  voterUserId?: Types.ObjectId | string;
  voterCompanyId?: Types.ObjectId | string;
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

  const filter: any = { noteId: payload.noteId };
  if (payload.voterUserId) filter.voterUserId = payload.voterUserId;
  if (payload.voterCompanyId) filter.voterCompanyId = payload.voterCompanyId;

  await Vote.findOneAndUpdate(filter, payload, { upsert: true, new: true });

  // Recalculate counts
  const upCount = await Vote.countDocuments({ noteId: payload.noteId, type: "up" });
  const downCount = await Vote.countDocuments({ noteId: payload.noteId, type: "down" });
  await Note.findByIdAndUpdate(payload.noteId, { upvotes: upCount, downvotes: downCount });

  return { upvotes: upCount, downvotes: downCount };
};

const getVotesByNote = async (noteId: string) => {
  return Vote.find({ noteId }).populate("voterUserId voterCompanyId");
};

const deleteVote = async (noteId: string, voterUserId?: string, voterCompanyId?: string) => {
  const filter: any = { noteId };
  if (voterUserId) filter.voterUserId = voterUserId;
  if (voterCompanyId) filter.voterCompanyId = voterCompanyId;

  await Vote.findOneAndDelete(filter);

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
