import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Note } from "./note.model";
import { NoteHistory } from "../noteHistory/noteHistory.model";
import { NoteServices } from "./note.service";

const createNote = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const note = await NoteServices.createNote({ 
    ...req.body, 
    companyId: decodedToken.companyId._id, 
    authorUserId: decodedToken.userId 
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Note Created Successfully",
    data: note,
  });
});

const getNote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await NoteServices.getNoteById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note Retrieved Successfully",
    data: note,
  });
});

const updateNote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user as JwtPayload;
  const up = await NoteServices.updateNote(id, decodedToken.userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note Updated Successfully",
    data: up,
  });
});

const listWorkspaceNotes = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { q } = req.query as { q?: string };
  const notes = await NoteServices.listWorkspaceNotes(workspaceId, q);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Workspace Notes Retrieved Successfully",
    data: notes,
  });
});

const listPublicNotes = catchAsync(async (req: Request, res: Response) => {
  const { q, sort } = req.query as { q?: string; sort?: string };
  const notes = await NoteServices.listPublicNotes(q, sort);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Public Notes Retrieved Successfully",
    data: notes,
  });
});

const restoreHistory = catchAsync(async (req: Request, res: Response) => {
  const { id, historyId } = req.params;
  const hist = await NoteHistory.findOne({ _id: historyId, noteId: id });
  if (!hist) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "History not found",
      data: null,
    });
  }
  const updated = await Note.findByIdAndUpdate(id, { content: hist.previousContent, title: hist.previousTitle }, { new: true });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "History Restored Successfully",
    data: updated,
  });
});

export const NoteControllers = {
  createNote,
  getNote,
  updateNote,
  listWorkspaceNotes,
  listPublicNotes,
  restoreHistory,
};
