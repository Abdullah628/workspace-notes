/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { hashPassword } from "../../utils/hash";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IGenericResponse } from "../../interfaces/common";

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("company");

  return {
    data: user,
  };
};

const createUser = async (payload: Partial<IUser>, logActor?: JwtPayload) => {
  const {
    email,
    password,
    company,
    role: incomingRole,
    ...rest
  } = payload;

  if (!email) throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  if (!password) throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  // if (!company) throw new AppError(httpStatus.BAD_REQUEST, "Company is required");

  const isUserExist = await User.findOne({ email, company });
  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist in this company");

  // Validate the role exists if provided
  const roleUpper = String(incomingRole || Role.MEMBER)
    .trim()
    .toUpperCase() as Role;
 

  const hashedPassword = await hashPassword(password as string);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };


  const user = await User.create({
    company,
    email,
    password: hashedPassword,
    auths: [authProvider],
    role: roleUpper,
    ...rest,
  });
 

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
  logActor?: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // Only OWNERs can change roles
  if (payload.role && decodedToken.role !== Role.OWNER) {
    throw new AppError(httpStatus.FORBIDDEN, "Only owners can change user roles");
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password as string);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  // Log user update
  ////console.log("--------------------------------------------", userId);
  if (userId) {
    try {
      const actor = (logActor as any) || decodedToken;
      const actorId = (logActor as any)?.userId || decodedToken?.userId || null;
      const actorPayload = logActor || decodedToken;
      //console.debug("[DEBUG] addLog - User Updated", {
      //   action: "User Updated",
      //   actor,
      //   actorUserId: actorId,
      //   targetUserId: userId,
      //   fields: Object.keys(payload || {}),
      // });
      // Only create a log if we have an actorId or a configured system fallback will handle it
      // Prefer a human-friendly actor label (name or email) when available
      const actorLabel =
        (actor && (actor.name || actor.email)) || actorId || "system";
      // Prefer displaying updated user's name/email instead of raw id when available
      const targetLabel =
        (newUpdatedUser as any)?.name ||
        (newUpdatedUser as any)?.email ||
        userId;
      
    } catch (e) {
      // console.error("Failed to log user update:", e);
    }
  }

  return newUpdatedUser;
};

const getAllUsers = async (
  query: Record<string, string>
): Promise<IGenericResponse<IUser[]>> => {
  const modifiedQuery = { ...query };

  // Extract orgId from query if present
  const { orgId, ...restQuery } = modifiedQuery;

  // Build base query with orgId filter if provided
  const baseQuery = orgId
    ? User.find({ org: orgId }).populate("org", "orgName")
    : User.find().populate("org", "orgName");

  const queryBuilder = new QueryBuilder(baseQuery, restQuery)
    .filter()
    .search(["name", "email", "phone"])
    .sort()
    .fields()
    .paginate();

  const allUsers = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: allUsers,
    meta,
  };
};

const updateMe = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
  logActor?: JwtPayload
) => {
  const ifUserExist = await User.findById(decodedToken?.userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password as string);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(
    decodedToken?.userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );


  return newUpdatedUser;
};


const getUserById = async (id: string) => {
  const user = await User.findById(id).lean();
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};


export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  updateMe,
  getUserById,
};
