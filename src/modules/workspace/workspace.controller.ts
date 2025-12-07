import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WorkspaceServices } from "./workspace.service";

const createWorkspace = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  console.log("Decoded Token in createWorkspace:", decodedToken);
  const workspace = await WorkspaceServices.createWorkspace({ 
    ...req.body, 
    companyId: decodedToken.companyId._id, 
    createdBy: decodedToken.userId 
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workspace Created Successfully",
    data: workspace,
  });
});

const getWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspace = await WorkspaceServices.getWorkspaceById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Workspace Retrieved Successfully",
    data: workspace,
  });
});

const listWorkspacesByCompany = catchAsync(async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const workspaces = await WorkspaceServices.listWorkspacesByCompany(companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Workspaces Retrieved Successfully",
    data: workspaces,
  });
});

const listMyWorkspaces = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const workspaces = await WorkspaceServices.listMyWorkspaces(decodedToken.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Workspaces Retrieved Successfully",
    data: workspaces,
  });
});

const updateWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspace = await WorkspaceServices.updateWorkspace(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Workspace Updated Successfully",
    data: workspace,
  });
});

const deleteWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await WorkspaceServices.deleteWorkspace(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Workspace Deleted Successfully",
    data: null,
  });
});

export const WorkspaceControllers = {
  createWorkspace,
  getWorkspace,
  listWorkspacesByCompany,
  listMyWorkspaces,
  updateWorkspace,
  deleteWorkspace,
};
