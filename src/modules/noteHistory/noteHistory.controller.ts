import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NoteHistoryServices } from "./noteHistory.service";

const getHistoryByNote = catchAsync(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const history = await NoteHistoryServices.getHistoryByNote(noteId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note History Retrieved Successfully",
    data: history,
  });
});

const getHistoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const history = await NoteHistoryServices.getHistoryById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "History Entry Retrieved Successfully",
    data: history,
  });
});

export const NoteHistoryControllers = {
  getHistoryByNote,
  getHistoryById,
};
