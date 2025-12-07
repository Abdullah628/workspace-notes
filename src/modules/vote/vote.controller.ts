import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VoteServices } from "./vote.service";

const createOrUpdateVote = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteServices.createOrUpdateVote(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote Submitted Successfully",
    data: result,
  });
});

const getVotesByNote = catchAsync(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const votes = await VoteServices.getVotesByNote(noteId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Votes Retrieved Successfully",
    data: votes,
  });
});

const deleteVote = catchAsync(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { voterUserId, voterCompanyId } = req.body;
  const result = await VoteServices.deleteVote(noteId, voterUserId, voterCompanyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vote Deleted Successfully",
    data: result,
  });
});

export const VoteControllers = {
  createOrUpdateVote,
  getVotesByNote,
  deleteVote,
};
