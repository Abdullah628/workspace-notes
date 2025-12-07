import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { NoteHistory } from "./noteHistory.model";

const createHistoryEntry = async (payload: {
  noteId: Types.ObjectId | string;
  previousContent: string;
  previousTitle?: string;
  changedByUserId: Types.ObjectId | string;
}) => {
  return NoteHistory.create(payload);
};

const getHistoryByNote = async (noteId: string) => {
  return NoteHistory.find({ noteId }).populate("changedByUserId").sort({ createdAt: -1 }).limit(50);
};

const getHistoryById = async (id: string) => {
  const history = await NoteHistory.findById(id);
  if (!history) {
    throw new AppError(httpStatus.NOT_FOUND, "History not found");
  }
  return history;
};

const deleteOldHistory = async (daysOld: number = 7) => {
  const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return NoteHistory.deleteMany({ createdAt: { $lt: cutoff } });
};

export const NoteHistoryServices = {
  createHistoryEntry,
  getHistoryByNote,
  getHistoryById,
  deleteOldHistory,
};
