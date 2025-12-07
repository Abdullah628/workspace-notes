import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Note, NoteDocument } from "./note.model";
import { NoteHistory } from "../noteHistory/noteHistory.model";

const createNote = async (payload: Partial<NoteDocument> & {
  workspaceId: Types.ObjectId | string;
  companyId: Types.ObjectId | string;
  authorUserId: Types.ObjectId | string;
}) => {
  return Note.create(payload as any);
};

const getNoteById = async (id: string) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }
  return note;
};

const updateNote = async (
  id: string,
  updaterUserId: string,
  payload: Partial<Pick<NoteDocument, "title" | "content" | "tags" | "type" | "isDraft">>
) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }

  await NoteHistory.create({
    noteId: note._id,
    previousContent: note.content,
    previousTitle: note.title,
    changedByUserId: updaterUserId,
  });

  return Note.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const listWorkspaceNotes = async (workspaceId: string, titleQuery?: string) => {
  const filter: any = { workspaceId };
  if (titleQuery) filter.title = { $regex: titleQuery, $options: "i" };
  return Note.find(filter).sort({ updatedAt: -1 }).limit(100);
};

const listPublicNotes = async (titleQuery?: string, sort?: string) => {
  const filter: any = { type: "public", isDraft: false };
  if (titleQuery) filter.title = { $regex: titleQuery, $options: "i" };

  let sortOpt: any = { createdAt: -1 };
  if (sort === "old") sortOpt = { createdAt: 1 };
  if (sort === "upvotes") sortOpt = { upvotes: -1 };
  if (sort === "downvotes") sortOpt = { downvotes: -1 };

  console.log("Filter:", filter, "Sort Option:", sortOpt);

  return Note.find(filter).sort(sortOpt).limit(100);
};

const deleteNote = async (id: string) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found");
  }
  
  // Delete associated history
  await NoteHistory.deleteMany({ noteId: id });
  
  // Delete note
  await Note.findByIdAndDelete(id);
  
  return note;
};

export const NoteServices = {
  createNote,
  getNoteById,
  updateNote,
  listWorkspaceNotes,
  listPublicNotes,
  deleteNote,
};
