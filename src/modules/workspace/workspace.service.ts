import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Workspace } from "./workspace.model";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

const createWorkspace = async (payload: { 
  companyId: Types.ObjectId | string; 
  name: string; 
  description?: string; 
  createdBy: Types.ObjectId | string 
}) => {
  // Verify user is OWNER
  const user = await User.findById(payload.createdBy);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  
  if (user.role !== Role.OWNER) {
    throw new AppError(httpStatus.FORBIDDEN, "Only company owners can create workspaces");
  }

  // Verify user belongs to the company
  if (user.company.toString() !== payload.companyId.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only create workspaces in your own company");
  }

  return Workspace.create(payload);
};

const getWorkspaceById = async (id: string) => {
  const workspace = await Workspace.findById(id).populate("companyId");
  if (!workspace) {
    throw new AppError(httpStatus.NOT_FOUND, "Workspace not found");
  }
  return workspace;
};

const listWorkspacesByCompany = async (companyId: string) => {
  return Workspace.find({ companyId }).sort({ createdAt: -1 });
};

const listMyWorkspaces = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return Workspace.find({ companyId: user.company }).populate("companyId").sort({ createdAt: -1 });
};

const updateWorkspace = async (id: string, payload: { name?: string; description?: string }) => {
  const workspace = await Workspace.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!workspace) {
    throw new AppError(httpStatus.NOT_FOUND, "Workspace not found");
  }
  return workspace;
};

const deleteWorkspace = async (id: string) => {
  const workspace = await Workspace.findByIdAndDelete(id);
  if (!workspace) {
    throw new AppError(httpStatus.NOT_FOUND, "Workspace not found");
  }
  return workspace;
};

export const WorkspaceServices = {
  createWorkspace,
  getWorkspaceById,
  listWorkspacesByCompany,
  listMyWorkspaces,
  updateWorkspace,
  deleteWorkspace,
};
